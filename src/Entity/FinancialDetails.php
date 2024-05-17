<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="financialDetails")
 */
class FinancialDetails
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(name="sourceOfFunds", type="string", length=255)
     */
    private $sourceOfFunds;

    /**
     * @ORM\Column(name="currency", type="string", length=50)
     */
    private $currency;

    /**
     * @ORM\Column(name="monthlyBasicSalary", type="float")
     */
    private $monthlyBasicSalary;

    /**
     * @ORM\Column(name="monthlyAllowances", type="float")
     */
    private $monthlyAllowances;

    /**
     * @ORM\Column(name="additionalIncomeSources", type="string", length=255)
     */
    private $additionalIncomeSources;

    /**
     * @ORM\Column(name="totalEstimatedMonthlyIncome", type="float")
     */
    private $totalEstimatedMonthlyIncome;

    /**
     * @ORM\Column(name="isWealthInherited", type="boolean")
     */
    private $isWealthInherited;

    /**
     * @ORM\Column(name="expectedNumberOfTransactions", type="integer")
     */
    private $expectedNumberOfTransactions;

    /**
     * @ORM\Column(name="expectedValueOfTransactions", type="float")
     */
    private $expectedValueOfTransactions;

    /**
     * @ORM\Column(name="frequency", type="string", length=50)
     */
    private $frequency;

    /**
     * @ORM\Column(name="otherAccountsAtBanks", type="boolean")
     */
    private $hasOtherAccounts;

    /**
     * @ORM\Column(name="bankName", type="string", length=255, nullable=true)
     */
    private $bankName;

    /**
     * @ORM\Column(name="country", type="string", length=255, nullable=true)
     */
    private $country;

    /**
     * @ORM\Column(name="accountBalance", type="float", nullable=true)
     */
    private $accountBalance;

    /**
     * @ORM\Column(name="natureOfRelation", type="string", length=50, nullable=true)
     */
    private $natureOfRelation;

    /**
     * @ORM\Column(name="purposeOfRelation", type="string", length=255, nullable=true)
     */
    private $purposeOfRelation;


    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="financialDetails")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSourceOfFunds(): ?string
    {
        return $this->sourceOfFunds;
    }

    public function setSourceOfFunds(string $sourceOfFunds): self
    {
        $this->sourceOfFunds = $sourceOfFunds;

        return $this;
    }

    public function getCurrency(): ?string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): self
    {
        $this->currency = $currency;

        return $this;
    }

    public function getMonthlyBasicSalary(): ?float
    {
        return $this->monthlyBasicSalary;
    }

    public function setMonthlyBasicSalary(float $monthlyBasicSalary): self
    {
        $this->monthlyBasicSalary = $monthlyBasicSalary;

        return $this;
    }

    public function getMonthlyAllowances(): ?float
    {
        return $this->monthlyAllowances;
    }

    public function setMonthlyAllowances(float $monthlyAllowances): self
    {
        $this->monthlyAllowances = $monthlyAllowances;

        return $this;
    }

    public function getAdditionalIncomeSources(): ?string
    {
        return $this->additionalIncomeSources;
    }

    public function setAdditionalIncomeSources(string $additionalIncomeSources): self
    {
        $this->additionalIncomeSources = $additionalIncomeSources;

        return $this;
    }

    public function getTotalEstimatedMonthlyIncome(): ?float
    {
        return $this->totalEstimatedMonthlyIncome;
    }

    public function setTotalEstimatedMonthlyIncome(float $totalEstimatedMonthlyIncome): self
    {
        $this->totalEstimatedMonthlyIncome = $totalEstimatedMonthlyIncome;

        return $this;
    }

    public function getIsWealthInherited(): ?bool
    {
        return $this->isWealthInherited;
    }

    public function setIsWealthInherited(bool $isWealthInherited): self
    {
        $this->isWealthInherited = $isWealthInherited;

        return $this;
    }

    public function getExpectedNumberOfTransactions(): ?int
    {
        return $this->expectedNumberOfTransactions;
    }

    public function setExpectedNumberOfTransactions(int $expectedNumberOfTransactions): self
    {
        $this->expectedNumberOfTransactions = $expectedNumberOfTransactions;

        return $this;
    }

    public function getExpectedValueOfTransactions(): ?float
    {
        return $this->expectedValueOfTransactions;
    }

    public function setExpectedValueOfTransactions(float $expectedValueOfTransactions): self
    {
        $this->expectedValueOfTransactions = $expectedValueOfTransactions;

        return $this;
    }

    public function getFrequency(): ?string
    {
        return $this->frequency;
    }

    public function setFrequency(string $frequency): self
    {
        $this->frequency = $frequency;

        return $this;
    }

    public function getHasOtherAccounts(): ?bool
    {
        return $this->hasOtherAccounts;
    }

    public function setHasOtherAccounts(bool $hasOtherAccounts): self
    {
        $this->hasOtherAccounts = $hasOtherAccounts;

        return $this;
    }

    public function getBankName(): ?string
    {
        return $this->bankName;
    }

    public function setBankName(?string $bankName): self
    {
        $this->bankName = $bankName;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getAccountBalance(): ?float
    {
        return $this->accountBalance;
    }

    public function setAccountBalance(?float $accountBalance): self
    {
        $this->accountBalance = $accountBalance;

        return $this;
    }

    public function getNatureOfRelation(): ?string
    {
        return $this->natureOfRelation;
    }

    public function setNatureOfRelation(?string $natureOfRelation): self
    {
        $this->natureOfRelation = $natureOfRelation;

        return $this;
    }

    public function getPurposeOfRelation(): ?string
    {
        return $this->purposeOfRelation;
    }

    public function setPurposeOfRelation(?string $purposeOfRelation): self
    {
        $this->purposeOfRelation = $purposeOfRelation;

        return $this;
    }


    public function getUser(): ?Users
    {
        return $this->user;
    }

    public function setUser(?Users $user): self
    {
        $this->user = $user;

        return $this;
    }
}
