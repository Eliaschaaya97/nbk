<?php

namespace App\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DateTime;

/**
 * @ORM\Entity
 * @ORM\Table(name="users")
 */
class Users
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(name="mothersName", type="string", length=255)
     */
    private $mothersName;

    /**
     * @ORM\Column(name="gender", type="string", length=10)
     */
    private $gender;

    /**
     * @ORM\Column(name="dob", type="date")
     */
    private $dob;

    /**
     * @ORM\Column(name="placeOfBirth", type="string", length=255)
     */
    private $placeOfBirth;

    /**
     * @ORM\Column(name="countryOfOrigin", type="string", length=255)
     */
    private $countryOfOrigin;

    /**
     * @ORM\Column(name="nationalId", type="string", length=50)
     */
    private $nationalId;

    /**
     * @ORM\Column(name="expirationDateNationalId", type="date")
     */
    private $expirationDateNationalId;

    /**
     * @ORM\Column(name="registerPlaceNo", type="string", length=255)
     */
    private $registerPlaceNo;

    /**
     * @ORM\Column(name="maritalStatus", type="string", length=20)
     */
    private $maritalStatus;

    /**
     * @ORM\Column(name="passportNumber", type="string", length=50)
     */
    private $passportNumber;

    /**
     * @ORM\Column(name="placeOfIssuePassport", type="string", length=255)
     */
    private $placeOfIssuePassport;

    /**
     * @ORM\Column(name="expirationDatePassport", type="date")
     */
    private $expirationDatePassport;

    /**
     * @ORM\Column(name="otherNationalities", type="string", length=255)
     */
    private $otherNationalities;

    /**
     * @ORM\Column(name="statusInLebanon", type="string", length=50)
     */
    private $statusInLebanon;

    /**
     * @ORM\Column(name="otherCountriesOfTaxResidence", type="string", length=255)
     */
    private $otherCountriesOfTaxResidence;

    /**
     * @ORM\Column(name="taxResidencyIdNumber", type="string", length=50)
     */
    private $taxResidencyIdNumber;

    /**
     * @ORM\Column(name="spouseName", type="string", length=255)
     */
    private $spouseName;

    /**
     * @ORM\Column(name="spouseProfession", type="string", length=255)
     */
    private $spouseProfession;

    /**
     * @ORM\Column(name="noOfChildren", type="integer")
     */
    private $noOfChildren;


    /**
     * @ORM\OneToMany(targetEntity=Address::class, mappedBy="user", orphanRemoval=true)
     */
    private $addresses;

    /**
     * @ORM\OneToMany(targetEntity=WorkDetails::class, mappedBy="user", orphanRemoval=true)
     */
    private $workDetails;

    /**
     * @ORM\OneToMany(targetEntity=BeneficiaryRightsOwner::class, mappedBy="user", orphanRemoval=true)
     */
    private $beneficiaryRightsOwners;

    /**
     * @ORM\OneToMany(targetEntity=PoliticalPositionDetails::class, mappedBy="user", orphanRemoval=true)
     */
    private $politicalPositionDetails;

    /**
     * @ORM\OneToMany(targetEntity=FinancialDetails::class, mappedBy="user", orphanRemoval=true)
     */
    private $financialDetails;

    public function __construct()
    {
        $this->expirationDateNationalId = new DateTime();

        $this->addresses = new ArrayCollection();
        $this->workDetails = new ArrayCollection();
        $this->beneficiaryRightsOwners = new ArrayCollection();
        $this->politicalPositionDetails = new ArrayCollection();
        $this->financialDetails = new ArrayCollection();
    }

    public function getMothersName(): ?string
    {
        return $this->mothersName;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function getDob(): ?\DateTimeInterface
    {
        return $this->dob;
    }

    public function getPlaceOfBirth(): ?string
    {
        return $this->placeOfBirth;
    }

    public function getCountryOfOrigin(): ?string
    {
        return $this->countryOfOrigin;
    }

    public function getNationalId(): ?string
    {
        return $this->nationalId;
    }

    public function getExpirationDateNationalId(): ?\DateTimeInterface
    {
        return $this->expirationDateNationalId;
    }

    public function getRegisterPlaceNo(): ?string
    {
        return $this->registerPlaceNo;
    }

    public function getMaritalStatus(): ?string
    {
        return $this->maritalStatus;
    }

    public function getPassportNumber(): ?string
    {
        return $this->passportNumber;
    }

    public function getPlaceOfIssuePassport(): ?string
    {
        return $this->placeOfIssuePassport;
    }

    public function getExpirationDatePassport(): ?\DateTimeInterface
    {
        return $this->expirationDatePassport;
    }

    public function getOtherNationalities(): ?string
    {
        return $this->otherNationalities;
    }

    public function getStatusInLebanon(): ?string
    {
        return $this->statusInLebanon;
    }

    public function getOtherCountriesTaxResidence(): ?string
    {
        return $this->otherCountriesOfTaxResidence;
    }

    public function getTaxResidencyIdNumber(): ?string
    {
        return $this->taxResidencyIdNumber;
    }

    public function getSpouseName(): ?string
    {
        return $this->spouseName;
    }

    public function getSpouseProfession(): ?string
    {
        return $this->spouseProfession;
    }

    public function getNoOfChildren(): ?int
    {
        return $this->noOfChildren;
    }

    public function setMothersName(string $mothersName): self
    {
        $this->mothersName = $mothersName;

        return $this;
    }

    public function setGender(string $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function setDob(\DateTimeInterface $dob): self
    {
        $this->dob = $dob;

        return $this;
    }

    public function setPlaceOfBirth(string $placeOfBirth): self
    {
        $this->placeOfBirth = $placeOfBirth;

        return $this;
    }

    public function setCountryOfOrigin(string $countryOfOrigin): self
    {
        $this->countryOfOrigin = $countryOfOrigin;

        return $this;
    }

    public function setNationalId(string $nationalId): self
    {
        $this->nationalId = $nationalId;

        return $this;
    }

    public function setExpirationDateNationalId(\DateTimeInterface $expirationDateNationalId): self
    {
        $this->expirationDateNationalId = $expirationDateNationalId;

        return $this;
    }

    public function setRegisterPlaceNo(string $registerPlaceNo): self
    {
        $this->registerPlaceNo = $registerPlaceNo;

        return $this;
    }

    public function setMaritalStatus(string $maritalStatus): self
    {
        $this->maritalStatus = $maritalStatus;

        return $this;
    }

    public function setPassportNumber(string $passportNumber): self
    {
        $this->passportNumber = $passportNumber;

        return $this;
    }

    public function setPlaceOfIssuePassport(string $placeOfIssuePassport): self
    {
        $this->placeOfIssuePassport = $placeOfIssuePassport;

        return $this;
    }

    public function setExpirationDatePassport(\DateTimeInterface $expirationDatePassport): self
    {
        $this->expirationDatePassport = $expirationDatePassport;

        return $this;
    }

    public function setOtherNationalities(string $otherNationalities): self
    {
        $this->otherNationalities = $otherNationalities;

        return $this;
    }

    public function setStatusInLebanon(string $statusInLebanon): self
    {
        $this->statusInLebanon = $statusInLebanon;

        return $this;
    }

    public function setOtherCountriesTaxResidence(string $otherCountriesTaxResidence): self
    {
        $this->otherCountriesOfTaxResidence = $otherCountriesTaxResidence;

        return $this;
    }

    public function setTaxResidencyIdNumber(string $taxResidencyIdNumber): self
    {
        $this->taxResidencyIdNumber = $taxResidencyIdNumber;

        return $this;
    }

    public function setSpouseName(string $spouseName): self
    {
        $this->spouseName = $spouseName;

        return $this;
    }

    public function setSpouseProfession(string $spouseProfession): self
    {
        $this->spouseProfession = $spouseProfession;

        return $this;
    }

    public function setNoOfChildren(int $noOfChildren): self
    {
        $this->noOfChildren = $noOfChildren;

        return $this;
    }

    /**
     * @return Collection|Address[]
     */
    public function getAddresses(): Collection
    {
        return $this->addresses;
    }

    /**
     * @return Collection|WorkDetails[]
     */
    public function getWorkDetails(): Collection
    {
        return $this->workDetails;
    }

    /**
     * @return Collection|BeneficiaryRightsOwner[]
     */
    public function getBeneficiaryRightsOwners(): Collection
    {
        return $this->beneficiaryRightsOwners;
    }

    /**
     * @return Collection|PoliticalPositionDetails[]
     */
    public function getPoliticalPositionDetails(): Collection
    {
        return $this->politicalPositionDetails;
    }

    /**
     * @return Collection|FinancialDetails[]
     */
    public function getFinancialDetails(): Collection
    {
        return $this->financialDetails;
    }
}
