<?php

namespace App\Service;

use App\Entity\Address;
use App\Entity\BeneficiaryRightsOwner;
use App\Entity\FinancialDetails;
use App\Entity\PoliticalPositionDetails;
use App\Entity\Users;
use App\Entity\WorkDetails;
use App\Utils\Helper;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GenerallServices
{

    private $SUYOOL_API_HOST;
    private $NOTIFICATION_SUYOOL_HOST;
    private $client;
    private $merchantAccountID;
    private $hash_algo;
    private $winning;
    private $cashout;
    private $cashin;
    private $METHOD_POST = "POST";
    private $METHOD_GET = "GET";
    private $helper;
    private $userlog;

    public function __construct()
    {
        $this->hash_algo = $_ENV['ALGO'];
       
    }


    public static function decrypt($stringToDecrypt)
    {
        $decrypted_string = openssl_decrypt($stringToDecrypt, $_ENV['CIPHER_ALGORITHME'], $_ENV['DECRYPT_KEY'], 0, $_ENV['INITIALLIZATION_VECTOR']);
        return $decrypted_string;
    }

    public static function decryptWebKey($webkey)
    {
        $webkey = $webkey['authorization'] ?? $webkey['Authorization'] ?? null;
        $webkeyDecrypted = openssl_decrypt($webkey, $_ENV['CIPHER_ALGORITHME'], $_ENV['DECRYPT_KEY'], 0, $_ENV['INITIALLIZATION_VECTOR']);
        // dd($webkeyDecrypted);
        try {
            $webkeyParts = explode('!#!', $webkeyDecrypted);
            $webkeyArray = [
                'merchantId' => $webkeyParts[0],
                'devicesType' => $webkeyParts[1],
                'lang' => $webkeyParts[2],
                'timestamp' => $webkeyParts[3],
                'message' => 'Success',
            ];
        } catch (Exception $e) {
            $webkeyArray = [
                'merchantId' => null,
                'devicesType' => null,
                'lang' => null,
                'timestamp' => null,
                'message' => 'Failed to decrypt webkey',
            ];
        }

        return $webkeyArray;
    }

    public static function aesDecryptString($base64StringToDecrypt)
    {
        // $decryptedData = openssl_decrypt($base64StringToDecrypt, 'AES128', "hdjs812k389dksd5", 0, $_ENV['INITIALLIZATION_VECTOR']);
        // return $decryptedData;
        try {
            $passphraseBytes = utf8_encode("hdjs812k389dksd5");
            $decryptedData = openssl_decrypt($base64StringToDecrypt, 'AES128', $passphraseBytes, 0, $_ENV['INITIALLIZATION_VECTOR']);

            return $decryptedData;
        } catch (Exception $e) {
            return $base64StringToDecrypt;
        }
    }


    public function convertOnlyUserYesToArray($user): array{

        
        return [
            'fullName' => $user['fullName'],
            'mobileNumb' => $user['mobileNumb'],
            'email' => $user['email'],
            'branchUnit' =>$user['branchUnit'],
            'otherNationalities' =>['None'],
        ];
    }

    public function convertFinancialYesToArray(): array
    {
        return [
            'additionalIncomeSources' =>['None'],
        ];
    }



    public function convertUserToArray(Users $user): array
    {
        $dob = $user->getDob() instanceof \DateTime ? $user->getDob()->format('Y-m-d') : '';
        $expirationDate = $user->getExpirationDateNationalId() instanceof \DateTime ? $user->getExpirationDateNationalId()->format('Y-m-d') : '';
    
        return [
            'fullName' => $user->getFullName(),
            'mobileNumb' => $user->getMobileNumb(),
            'email' => $user->getEmail(),
            'branchUnit' => $user->getBranchUnit(),
            'mothersName' => $user->getMothersName(),
            'gender' => $user->getGender(),
            'dob' => $dob,
            'placeOfBirth' => $user->getPlaceOfBirth(),
            'countryOfOrigin' => $user->getCountryOfOrigin(),
            'nationality' => $user->getNationality(),
            'nationalId' => $user->getNationalId(),
            'expirationDateNationalId' => $expirationDate,
            'registerPlaceAndNo' => $user->getRegisterPlaceNo(),
            'maritalStatus' => $user->getMaritalStatus(),
            'passportNumber' => $user->getPassportNumber(),
            'placeOfIssuePassport' => $user->getPlaceOfIssuePassport(),
            'expirationDatePassport' => $user->getExpirationDatePassport(),
            'otherNationalities' => $user->getOtherNationalities(),
            'statusInLebanon' => $user->getStatusInLebanon(),
            'otherCountriesOfTaxResidence' => $user->getOtherCountriesTaxResidence(),
            'taxResidencyIdNumber' => $user->getTaxResidencyIdNumber(),
            'spouseName' => $user->getSpouseName(),
            'spouseProfession' => $user->getSpouseProfession(),
            'noOfChildren' => $user->getNoOfChildren(),
        ];
    }

    public function convertAddressToArray($addressEntity): array
    {
        $address = $addressEntity[0];

        $className = Address::class;

        return [
            'city' => $address->getCity(),
            'street' =>$address->getStreet(),
            'building' =>$address->getBuilding(),
            'floor' =>$address->getFloor(),
            'apartment' =>$address->getApartment(),
            'houseTelephoneNumber' =>$address->getHouseTelephoneNumber(),
            'internationalAddress' =>$address->getInternationalAddress(),
            'internationalHouseTelephoneNumber' =>$address->getInternationalHouseTelephoneNumber(),
            'internationalMobileNumber' =>$address->getInternationalMobileNumber(),
            'alternateContactName' =>$address->getAlternateContactName(),
            'alternateTelephoneNumber' =>$address->getAlternateTelephoneNumber(),
            'intArea' =>$address->getIntArea(),
            'intStreet' =>$address->getIntStreet(),
            'intBuilding' =>$address->getIntBuilding(),
            'intFloor' =>$address->getIntFloor(),
            'intApartment' =>$address->getIntApartment(),
        ];
    }

    public function convertWorkDetailsToArray($workDetailsEntities): array
    {

        $workDetails = $workDetailsEntities[0];

        $className = WorkDetails::class;
        return [
            'profession' =>$workDetails->getProfession(),
            'jobTitle' =>$workDetails->getJobTitle(),
            'publicSector' =>$workDetails->getPublicSector(),
            'activitySector' =>$workDetails->getActivitySector(),
            'entityName' =>$workDetails->getEntityName(),
            'educationLevel' =>$workDetails->getEducationLevel(),
            'workAddress' =>$workDetails->getWorkAddress(),
            'workTelephoneNumber' =>$workDetails->getWorkTelephoneNumber(),
            'placeOfWorkListed' =>$workDetails->getPlaceOfWorkListed(),
            'grade' =>$workDetails->getGrade(),
        ];
    }

    public function convertBeneficiaryRightsOwnerToArray($beneficiaryRightsOwnerEntities): array
    {

        $beneficiaryRightsOwner = $beneficiaryRightsOwnerEntities[0];

        $className = BeneficiaryRightsOwner::class;


        $expirationDate = $beneficiaryRightsOwner->getExpirationDate();
        $expirationDateString = $expirationDate instanceof \DateTime ? $expirationDate->format('Y-m-d') : '';

        return [
            'customerSameAsBeneficiary' => $beneficiaryRightsOwner->getCustomerSameAsBeneficiary(),
            'broNationality' => $beneficiaryRightsOwner->getBroNationality(),
            'beneficiaryName' => $beneficiaryRightsOwner->getBeneficiaryName(),
            'relationship' => $beneficiaryRightsOwner->getRelationship(),
            'broCivilIdNumber' => $beneficiaryRightsOwner->getBroCivilIdNumber(),
            'expirationDate' => $expirationDateString,
            'reasonOfBro' => $beneficiaryRightsOwner->getReasonOfBro(),
            'address' => $beneficiaryRightsOwner->getAddress(),
            'profession' => $beneficiaryRightsOwner->getProfession(),
            'incomeWealthDetails' => $beneficiaryRightsOwner->getIncomeWealthDetails(),
        ];
    }

    public function convertPoliticalPositionDetailsToArray($politicalPositionDetailsEntities): array
    {
        $politicalPositionDetails = $politicalPositionDetailsEntities[0];

        $className = PoliticalPositionDetails::class;

        return [
            'politicalPosition' => $politicalPositionDetails->getPoliticalPosition(),
            'currentOrPrevious' => $politicalPositionDetails->getCurrentPrevious(),
            'yearOfRetirement' => $politicalPositionDetails->getYearOfRetirement(),
            'pepName' => $politicalPositionDetails->getPepName(),
            'relationship' => $politicalPositionDetails->getRelationship(),
            'pepPosition' => $politicalPositionDetails->getPepPosition(),
        ];
    }

    public function convertFinancialDetailsToArray($financialDetailsEntitiesils): array
{

    $financialDetails = $financialDetailsEntitiesils[0];
    $className = FinancialDetails::class;


    $additionalIncomeSources = $financialDetails->getAdditionalIncomeSourcesArray();
    $additionalIncomeSourcesString = is_array($additionalIncomeSources) ? implode(', ', $additionalIncomeSources) : '';

    return [
        'sourceOfFunds' =>$financialDetails->getSourceOfFunds(),
        'currency' =>$financialDetails->getCurrency(),
        'monthlyBasicSalary' =>$financialDetails->getMonthlyBasicSalary(),
        'monthlyAllowances' =>$financialDetails->getMonthlyAllowances(),
        'additionalIncomeSources' =>$additionalIncomeSourcesString,        
        'othersSourceOfFound' =>$financialDetails->getOthersSourceOfFound(),
        'totalEstimatedMonthlyIncome' =>$financialDetails->getTotalEstimatedMonthlyIncome(),
        'estimatedWealthAmount' =>$financialDetails->getEstimatedWealthAmount(),
        'isWealthInherited' =>$financialDetails->getIsWealthInherited(),
        'sourcesOfWealth' =>$financialDetails->getSourcesOfWealth(),
        'incomeCategory' =>$financialDetails->getIncomeCategory(),
        'expectedNumberOfTransactions' =>$financialDetails->getExpectedNumberOfTransactions(),
        'expectedValueOfTransactions' =>$financialDetails->getExpectedValueOfTransactions(),
        'frequency' =>$financialDetails->getFrequency(),
        'hasOtherAccounts' =>$financialDetails->getHasOtherAccounts(),
        'bankName' =>$financialDetails->getBankName(),
        'country' =>$financialDetails->getCountry(),
        'accountBalance' =>$financialDetails->getAccountBalance(),
        'bankName2' =>$financialDetails->getSecondBankName(),
        'country2' =>$financialDetails->getSecondCountry(),
        'accountBalance2' =>$financialDetails->getSecondBankBalance(),
        'bankName3' =>$financialDetails->getThirdBankName(),
        'country3' =>$financialDetails->getThirdAccountCountry(),
        'accountBalance3' =>$financialDetails->getThirdAccountBalance(),
        'natureOfRelation' =>$financialDetails->getNatureOfRelation(),
        'purposeOfRelation' =>$financialDetails->getPurposeOfRelation(),
        'selectIDType' =>$financialDetails->getSelectIDType(),
    ];
}

}
