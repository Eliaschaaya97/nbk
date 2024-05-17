<?php
// src/Repository/UsersRepository.php

namespace App\Repository;

use App\Entity\Users;
use Doctrine\ORM\EntityRepository; // Correct import statement

class UsersRepository
{
    public function createUser(array $userData): ?Users
    {
        $expirationDateNationalIdString = $userData['expirationDateNationalId'] ?? '';
        $expirationDateNationalId = new \DateTime($expirationDateNationalIdString);

        $passportExpirationDateString = $userData['passportExpirationDate'] ?? '';
        $passportExpirationDate = new \DateTime($passportExpirationDateString);

        $user = new Users();
        $user->setMothersName($userData['mothersName'] ?? '');
        $user->setGender($userData['gender'] ?? '');
        $user->setDob(\DateTime::createFromFormat('Y-m-d', $userData['dob'] ?? ''));
        $user->setPlaceOfBirth($userData['placeOfBirth'] ?? '');
        $user->setCountryOfOrigin($userData['countryOfOrigin'] ?? '');
        $user->setNationalId($userData['nationalId'] ?? '');
        $user->setExpirationDateNationalId($expirationDateNationalId);
        $user->setRegisterPlaceNo($userData['registerPlaceAndNo'] ?? '');
        $user->setMaritalStatus($userData['maritalStatus'] ?? '');
        $user->setPassportNumber($userData['passportNumber'] ?? '');
        $user->setPlaceOfIssuePassport($userData['placeOfIssuePassport'] ?? '');
        $user->setExpirationDatePassport($passportExpirationDate);
        $user->setOtherNationalities($userData['otherNationalities'] ?? '');
        $user->setStatusInLebanon($userData['statusInLebanon'] ?? '');
        $user->setOtherCountriesTaxResidence($userData['otherCountriesOfTaxResidence'] ?? '');
        $user->setTaxResidencyIdNumber($userData['taxResidencyIdNumber'] ?? '');
        $user->setSpouseName($userData['spouseName'] ?? '');
        $user->setSpouseProfession($userData['spouseProfession'] ?? '');
        $user->setNoOfChildren($userData['noOfChildren'] ?? 0);

        return $user;
    }
}
