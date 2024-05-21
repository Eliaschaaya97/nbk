<?php
// src/Repository/FinancialDetailsRepository.php

namespace App\Repository;

use App\Entity\FinancialDetails;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class FinancialDetailsRepository
{
    public function createFinancialDetails(array $userData): ?FinancialDetails
    {
        $financialDetails = new FinancialDetails();
        $financialDetails->setSourceOfFunds($userData['sourceOfFunds'] ?? '');
        $financialDetails->setCurrency($userData['currency'] ?? '');
        $financialDetails->setMonthlyBasicSalary($userData['monthlyBasicSalary'] ?? 0.0);
        $financialDetails->setMonthlyAllowances($userData['monthlyAllowances'] ?? 0.0);
        $financialDetails->setAdditionalIncomeSources($userData['additionalIncomeSources'] ?? '');
        $financialDetails->setTotalEstimatedMonthlyIncome($userData['totalEstimatedMonthlyIncome'] ?? 0.0);
        $financialDetails->setIsWealthInherited($userData['isWealthInherited'] ?? false);
        $financialDetails->setExpectedNumberOfTransactions($userData['expectedNumberOfTransactions'] ?? 0);
        $financialDetails->setExpectedValueOfTransactions($userData['expectedValueOfTransactions'] ?? 0.0);
        $financialDetails->setFrequency($userData['frequency'] ?? '');
        $financialDetails->setHasOtherAccounts($userData['hasOtherAccounts'] ?? false);
        $financialDetails->setBankName($userData['bankName'] ?? '');
        $financialDetails->setCountry($userData['country'] ?? '');
        $financialDetails->setAccountBalance($userData['accountBalance'] ?? 0.0);
        $financialDetails->setNatureOfRelation($userData['natureOfRelation'] ?? '');
        $financialDetails->setPurposeOfRelation($userData['purposeOfRelation'] ?? '');
        $financialDetails->setOthersSourceOfFound($userData['othersSourceOfFound'] ?? '');
        $financialDetails->setEstimatedWealthAmount($userData['estimatedWealthAmount'] ?? '');
        $financialDetails->setSourcesOfWealth($userData['sourcesOfWealth'] ?? '');
        $financialDetails->setSecondBankName($userData['bankName2'] ?? '');
        $financialDetails->setSecondCountry($userData['country2'] ?? '');
        $financialDetails->setSecondBankBalance($userData['accountBalance2'] ?? '');
        $financialDetails->setThirdBankName($userData['bankName3'] ?? '');
        $financialDetails->setThirdAccountCountry($userData['country3'] ?? '');
        $financialDetails->setThirdAccountBalance($userData['accountBalance3'] ?? '');


        return $financialDetails;
    }
}
