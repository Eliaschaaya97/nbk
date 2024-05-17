<?php
// src/Repository/AddressRepository.php

namespace App\Repository;

use App\Entity\Address;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class AddressRepository
{
    public function createAddress(array $userData): ?Address
    {
        $address = new Address();
        $address->setStreet($userData['street'] ?? '');
        $address->setBuilding($userData['building'] ?? '');
        $address->setFloor($userData['floor'] ?? '');
        $address->setApartment($userData['apartment'] ?? '');
        $address->setHouseTelephoneNumber($userData['houseTelephoneNumber'] ?? '');
        $address->setInternationalAddress($userData['internationalAddress'] ?? '');
        $address->setInternationalHouseTelephoneNumber($userData['internationalHouseTelephoneNumber'] ?? '');
        $address->setInternationalMobileNumber($userData['internationalMobileNumber'] ?? '');
        $address->setAlternateContactName($userData['alternateContactName'] ?? '');
        $address->setAlternateTelephoneNumber($userData['alternateTelephoneNumber'] ?? '');

        return $address;
    }
}
