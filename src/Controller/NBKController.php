<?php

namespace App\Controller;

use App\Entity\Address;
use App\Entity\BeneficiaryRightsOwner;
use App\Entity\FinancialDetails;

use App\Entity\PoliticalPositionDetails;
use App\Entity\Users;
use App\Entity\WorkDetails;
use App\Entity\Logs;
use App\Entity\Emails;
use App\Repository\AddressRepository;
use App\Repository\BeneficiaryRightsOwnerRepository;
use App\Repository\FinancialDetailsRepository;
use App\Repository\PoliticalPositionDetailsRepository;
use App\Repository\UsersRepository;
use App\Repository\WorkDetailsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Service\GenerallServices;
use DateTime;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Dompdf\Dompdf;
use Dompdf\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Psr\Log\LoggerInterface;

class NBKController extends AbstractController
{
	private $entityManager;
	private $generallServices;
	private $loggerInterface;


	public function __construct(EntityManagerInterface $entityManager, MailerInterface $mailer, GenerallServices $generallServices, LoggerInterface $loggerInterface)
	{
		$this->entityManager = $entityManager;
		$this->mailer = $mailer;
		$this->generallServices = $generallServices;
		$this->loggerInterface = $loggerInterface;
	}

	#[Route('/nbk', name: 'app_react')]
	public function index(): Response
	{
		$userAgent = $_SERVER['HTTP_USER_AGENT'];
		$deviceType = "";
		if (stripos($userAgent, 'Android') !== false) {
			$deviceType = "Android";
		} elseif (stripos($userAgent, 'iPhone') !== false || stripos($userAgent, 'iPad') !== false || stripos($userAgent, 'iPod') !== false) {
			$deviceType = "Iphone";
		}

		$parameters['deviceType'] = $deviceType;

		return $this->render('nbk/index.html.twig', [
			'parameters' => $parameters
		]);
	}

	#[Route('/submit-data', name: 'submitData', methods: ['POST'])]
	public function submit(Request $request, UsersRepository $usersRepository, AddressRepository $addressRepository, WorkDetailsRepository $workDetailsRepository, BeneficiaryRightsOwnerRepository $beneficiaryRepository, PoliticalPositionDetailsRepository $politicalPositionRepository, FinancialDetailsRepository $financialRepository): JsonResponse
	{
		$data = json_decode($request->getContent(), true);

		if ($data === null) {
			return new JsonResponse(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
		}

		$branchEmail = $this->getBranchEmail($data['user']['branchId']);
		// Create and save User entity using UserRepository
		$user = $usersRepository->createUser($data['user']);

		if (!$user) {
			return new JsonResponse(['error' => 'Failed to create user'], Response::HTTP_BAD_REQUEST);
		}

		unset($data['user']['branchId']);
		$userEmail = $data['user']['email'];

		if (!$this->isValidEmail($userEmail)) {
			return new JsonResponse(['error' => 'Invalid email address'], Response::HTTP_BAD_REQUEST);
		}

		$frontImageID = $data['financialDetails']['frontImageID'];
		$backImageID = $data['financialDetails']['backImageID'];

		$realStateImage = $data['financialDetails']['realEstateTitle'];
		$otherDocumentImage = $data['financialDetails']['otherDocument'];
		$accountStatementImage = $data['financialDetails']['accountStatement'];
		$employeeLetterImage = $data['financialDetails']['employerLetter'];

		$imageParts = explode(';base64,', $frontImageID);
		$imageBase64 = $imageParts[1];
		$imageType = explode('/', $imageParts[0])[1];

		//back
		$imagePartsBack = explode(';base64,', $backImageID);
		$imageBase64Back = $imagePartsBack[1];
		$imageTypeBack = explode('/', $imagePartsBack[0])[1];

		// Prepare the file path
		$fullName = $data['user']['fullName'];

		// Initialize an empty string to store the modified name
		$modifiedName = '';

		for ($i = 0; $i < strlen($fullName); $i++) {
			$char = $fullName[$i];

			if (ctype_alpha($char)) {
				$modifiedName .= $char;
			} else {
				$i++;
			}
		}

		$mobileNumb = $data['user']['mobileNumb'];
		$folderName = $modifiedName . '-' . $mobileNumb;
		$imageFolder = 'imageUser/' . str_replace(' ', '_', $folderName);
		$publicDir = $this->getParameter('kernel.project_dir') . '/public/' . $imageFolder;

		$imageRealEState = '';

		if (!empty($realStateImage)) {
			$imagePartsrealestate = explode(';base64,', $realStateImage);
			$imageBase64realestate = $imagePartsrealestate[1];
			$imageTyperealestate = explode('/', $imagePartsrealestate[0])[1];
			$imageRealEState = 'imageUser/' . $folderName . '/imageRealEState.' . $imageTyperealestate;
			$imageContentRealState = base64_decode($imageBase64realestate);
		}

		$imageotherdoc = '';

		if (!empty($otherDocumentImage)) {
			//other doc
			$imagePartsotherDocument = explode(';base64,', $otherDocumentImage);
			$imageBase64otherDocument = $imagePartsotherDocument[1];
			$imageTypeotherDocument = explode('/', $imagePartsotherDocument[0])[1];
			$imageotherdoc = 'imageUser/' . $folderName . '/imageotherdoc.' . $imageTypeotherDocument;
			$imageContentOtherDoc = base64_decode($imageBase64otherDocument);
		}

		$imageFrontaccoountStat = '';

		if (!empty($accountStatementImage)) {
			//account statement
			$imagePartsaccountStatement = explode(';base64,', $accountStatementImage);
			$imageBase64accountstatement = $imagePartsaccountStatement[1];
			$imageTypeaccountstatement = explode('/', $imagePartsaccountStatement[0])[1];
			$imageFrontaccoountStat = 'imageUser/' . $folderName . '/imageFrontaccoountStat.' . $imageTypeaccountstatement;
			$imageContentFrontAccountStat = base64_decode($imageBase64accountstatement);
		}

		$imageEmployerLetter = '';
		if (!empty($employeeLetterImage)) {
			//account statement
			//employee
			$imagePartsemployee = explode(';base64,', $employeeLetterImage);
			$imageBase64employee = $imagePartsemployee[1];
			$imageTypeemployee = explode('/', $imagePartsemployee[0])[1];
			$imageEmployerLetter = 'imageUser/' . $folderName . '/imageEmployerLetter.' . $imageTypeemployee;
			$imageContentEmployementLetter = base64_decode($imageBase64employee);
		}

		if (!file_exists($publicDir)) {
			mkdir($publicDir, 0777, true);
		}
		$imagePath = $publicDir . '/frontImageID.' . $imageType;
		$imageFront = 'imageUser/' . $folderName . '/frontImageID.' . $imageTypeBack;
		$imageBack = 'imageUser/' . $folderName . '/BackimageID.' . $imageTypeBack;


		// Decode the base64 data and save the file
		$imageContent = base64_decode($imageBase64);
		$imageContentBack = base64_decode($imageBase64Back);

		if (file_put_contents($imagePath, $imageContent) === false || file_put_contents($imageBack, $imageContentBack) === false) {
			return new JsonResponse(['error' => 'Failed to save image content'], Response::HTTP_INTERNAL_SERVER_ERROR);
		}


		if (isset($realStateImage)) {
			file_put_contents($imageRealEState, $imageContentRealState);
		}
		if (isset($otherDocumentImage)) {
			file_put_contents($imageotherdoc, $imageContentOtherDoc);
		}
		if (isset($accountStatementImage)) {
			file_put_contents($imageFrontaccoountStat, $imageContentFrontAccountStat);
		}
		if (isset($employeeLetterImage)) {
			file_put_contents($imageEmployerLetter, $imageContentEmployementLetter);
		}

		unset($data['financialDetails']['frontImageID']);
		unset($data['financialDetails']['backImageID']);
		unset($data['financialDetails']['employerLetter']);
		unset($data['financialDetails']['otherDocument']);
		unset($data['financialDetails']['accountStatement']);
		unset($data['financialDetails']['realEstateTitle']);

		// Set the user for Address and WorkDetails
		$address = $addressRepository->createAddress($data['address'] ?? []);
		if ($address) {
			$address->setUser($user);
		}

		$workDetails = $workDetailsRepository->createWorkDetails($data['workDetails'] ?? []);
		if ($workDetails) {
			$workDetails->setUser($user);
		}

		// Create and save BeneficiaryRightsOwner entity using BeneficiaryRightsOwnerRepository
		$beneficiary = $beneficiaryRepository->createBeneficiary($data['beneficiaryRightsOwner'] ?? []);
		if ($beneficiary) {
			$beneficiary->setUser($user);
		}

		// Create and save PoliticalPositionDetails entity using PoliticalPositionDetailsRepository
		$politicalPosition = $politicalPositionRepository->createPoliticalPosition($data['politicalPositionDetails'] ?? []);
		if ($politicalPosition) {
			$politicalPosition->setUser($user);
		}
		// Create and save FinancialDetails entity using FinancialDetailsRepository
		$financialDetails = $financialRepository->createFinancialDetails($data['financialDetails'] ?? [], $imageFront, $imageBack, $imageRealEState, $imageFrontaccoountStat,  $imageotherdoc, $imageEmployerLetter);

		if ($financialDetails) {
			$financialDetails->setUser($user);
		}

		// Persist and flush all entities
		$this->entityManager->persist($user);
		$this->entityManager->persist($address);
		$this->entityManager->persist($workDetails);
		$this->entityManager->persist($beneficiary);
		$this->entityManager->persist($politicalPosition);
		$this->entityManager->persist($financialDetails);
		$this->entityManager->flush();

		// $this->submitForm($user->getId());


		//GETTING THE IMAGES
		$publicDirectory = $_SERVER['DOCUMENT_ROOT'] . "/imageUser/";
		$folderdirectory = $publicDirectory . $folderName;

		$files = scandir($folderdirectory);

		$images = array();
		$i = 0;

		foreach ($files as $file) {
			if ($file === '.' || $file === '..') {
				continue;
			}
			$filePath = $folderdirectory . '/' . $file;
			if (is_file($filePath) && in_array(pathinfo($file, PATHINFO_EXTENSION), array('jpg', 'jpeg', 'png', 'gif'))) {
				$images[$i] = $filePath;
				$i++;
			}
		}


		$reference = $user->getId();

		$dateEmail = new DateTime();
		$dateEmailFormatted = $dateEmail->format('Y-m-d H:i:s');
		$pdfContent = $this->generateReportPdf($data, $dateEmailFormatted, $reference);

		$pdfFileName = sprintf('%s_%s.pdf', $modifiedName, $data['user']['mobileNumb']);
		$pdfFilePath = $folderdirectory . '/' . $pdfFileName;
		// dd($pdfFileName, $pdfFilePath);
		file_put_contents($pdfFilePath, $pdfContent);

		$images[$i] =$pdfFilePath;

		$branchEmailContent = '
		<p><strong>Application REF:</strong> User-' . htmlspecialchars($reference) . '</p>
		<p><strong>The customer:</strong> ' . htmlspecialchars($data['user']['fullName']) . '</p>
		<p><strong>Number:</strong> ' . htmlspecialchars($data['user']['mobileNumb']) . '</p>
		<p><strong>Email:</strong> ' . htmlspecialchars($data['user']['email']) . '</p>
		<p><strong>Accessed on:</strong> ' . htmlspecialchars($dateEmailFormatted) . ' the Mobile Banking Application to submit a new account opening application.</p>
		<p>Please contact the customer within 3-5 days since it is a new relation.</p>
		';

		$userEmailContent = '
		<p>Dear ' . htmlspecialchars($data['user']['fullName']) . '</p>
		</br>
		</br>
		<p>Thank you for choosing NBK Lebanon.\nWe will contact you within 3-5 days</p>
		</br>
		<p>Regards</p>
		';

		// user email content
		$email = new Emails();
		$email->setUserId($reference);
		$email->setReceiver($data['user']['email']);
		$email->setSubject("Thank you for choosing NBK Lebanon.");
		$email->setContent($userEmailContent);
		$email->setIdentifier("New Relation");
		$email->setFilesPath("");
		$email->setStatus("Pending");
		$this->entityManager->persist($email);
		$this->entityManager->flush();

		// branch email content
		$email = new Emails();
		$email->setUserId($reference);
		$email->setReceiver($branchEmail);
		$email->setSubject('Form submitted from ' . $data['user']['fullName']);
		$email->setContent($branchEmailContent);
		$email->setIdentifier("Branch");
		$email->setFilesPath($folderdirectory);
		//todo
		$email->setContents(json_encode($images));
		$email->setTestContent(json_encode($images));
		$email->setStatus("Pending");
		$this->entityManager->persist($email);
		$this->entityManager->flush();

		return new JsonResponse(['message' => 'Data saved successfully'], Response::HTTP_OK);
	}

	public function getBranchEmail($branchId)
	{

		$branchEmails = [1 => "sanayehbr@nbk.com.lb", 2 => "Bhamdounbr@nbk.com.lb", 3 => "PrivateBanking@nbk.com.lb"];
		//$branchEmails = [1 => "zeina.abdallah@nbk.com.lb ", 2 => "maysaa.nasereddine@nbk.com.lb", 3 => "zeina.abdallah@nbk.com.lb "];
		if (array_key_exists($branchId, $branchEmails)) {
			return $branchEmails[$branchId];
		} else {
			return null;
		}
	}

	#[Route('/submit-existing-user', name: 'submitExistingUser', methods: ['POST'])]
	public function submitExistingUser(Request $request, UsersRepository $usersRepository): JsonResponse
	{
		$data = json_decode($request->getContent(), true);

		if ($data === null) {
			return new JsonResponse(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
		}

		// Create and save User entity using UserRepository
		$user = $usersRepository->createExistingUser($data);

		if (!$user) {
			return new JsonResponse(['error' => 'Failed to create user'], Response::HTTP_BAD_REQUEST);
		}
		// Persist and flush all entities
		$this->entityManager->persist($user);
		$this->entityManager->flush();

		$dateEmail = new DateTime();

		$dateEmail = new DateTime();
		$time =  $dateEmail->format('H:i:s');
		$dateEmailFormatted = $dateEmail->format('Y-m-d H:i:s');


		$userRepository = $this->entityManager->getRepository(Users::class);
		$query = $userRepository->createQueryBuilder('u')
			->select('MAX(u.id)')
			->getQuery();
		$reference = $query->getSingleScalarResult();

		// $pdfContent = $this->generateReportPdfForYes($data, $time, $reference);
		$branchEmail = $this->getBranchEmail($data['branchId']);



		$branchEmailContent = '
		<p><strong>Application REF:</strong> User-' . htmlspecialchars($reference) . '</p>
		<p><strong>The customer:</strong> ' . htmlspecialchars($data['fullName']) . '</p>
		<p><strong>Number:</strong> ' . htmlspecialchars($data['mobileNumb']) . '</p>
		<p><strong>Email:</strong> ' . htmlspecialchars($data['email']) . '</p>
		<p><strong>Accessed on:</strong> ' . htmlspecialchars($dateEmailFormatted) . ' the Mobile Banking Application to submit a new account opening application.</p>
		<p>Please contact the customer within 3-5 days since he has already a relationship with NBK Lebanon.</p>
		';

		$userEmailContent = '
		<p>Dear ' . htmlspecialchars($data['fullName']) . '</p>
		</br>
		</br>
		<p>Thank you for choosing NBK Lebanon.\nWe will contact you within 3-5 days</p>
		</br>
		<p>Regards</p>
		';

		// user email content
		$email = new Emails();
		$email->setUserId($reference);
		$email->setReceiver($data['email']);
		$email->setSubject("Thank you for choosing NBK Lebanon.");
		$email->setContent($userEmailContent);
		$email->setIdentifier("Exisitng Relation");
		$email->setFilesPath("");
		$email->setStatus("Pending");
		$this->entityManager->persist($email);
		$this->entityManager->flush();

		// branch email content
		$email = new Emails();
		$email->setUserId($reference);
		$email->setReceiver($branchEmail);
		$email->setSubject('Form submitted from ' . $data['fullName']);
		$email->setContent($branchEmailContent);
		$email->setIdentifier("Branch");
		$email->setFilesPath("");
		$email->setStatus("Pending");
		$this->entityManager->persist($email);
		$this->entityManager->flush();
		
		return new JsonResponse(['message' => 'Data saved successfully'], Response::HTTP_OK);
	}

	#[Route('/users', name: 'users_list', methods: ['GET'])]
	public function usersList(Request $request, PaginatorInterface $paginator): Response
	{
		// Fetch the sorting parameters from the request
		$sortField = $request->query->get('sort', 'u.id');
		$sortDirection = $request->query->get('direction', 'DESC');

		// Fetch all users from the database
		$userRepository = $this->entityManager->getRepository(Users::class);
		$queryBuilder = $userRepository->createQueryBuilder('u')
			->leftJoin('u.addresses', 'a')
			->leftJoin('u.workDetails', 'w')
			->leftJoin('u.financialDetails', 'f')
			->leftJoin('u.politicalPositionDetails', 'p')
			->leftJoin('u.beneficiaryRightsOwners', 'b')
			->addSelect('a', 'w', 'f', 'p', 'b')
			->orderBy($sortField, $sortDirection);
		$query = $queryBuilder->getQuery();
		// Paginate the results
		$pagination = $paginator->paginate(
			$query, // Query to paginate
			$request->query->getInt('page', 1), // Current page number, default to 1
			15 // Items per page
		);

		// Render a template with the user data
		return $this->render('nbk/user_list.html.twig', [
			'pagination' => $pagination,
		]);
	}
	/**
	 * @Route("/user/checkMobile/{mobileNumber}", name="user_check_mobile")
	 */
	public function getUserByMobile($mobileNumber): Response
	{
		if (!$mobileNumber) {
			return new Response('Mobile number not provided', 400);
		}
		$user = $this->entityManager->getRepository(Users::class)->findOneBy(['mobileNumb' => $mobileNumber]);
		if (!$user) {
			$statusCode = 0;
			$message = 'Mobile number not provided';
		} else {
			$statusCode = 1;
			$message = 'User found';
		}
		return new JsonResponse([
			'status' => true,
			'message' => $message,
			'statusCode' => $statusCode,
		], 200);
	}

	#[Route('/userInfo/{id}', name: 'user_info', methods: ['GET'])]
	public function userInfo(int $id): Response
	{
		// Fetch all users from the database
		$userRepository = $this->entityManager->getRepository(Users::class);
		$user = $userRepository->createQueryBuilder('u')
			->leftJoin('u.addresses', 'a')
			->leftJoin('u.workDetails', 'w')
			->leftJoin('u.financialDetails', 'f')
			->leftJoin('u.politicalPositionDetails', 'p')
			->leftJoin('u.beneficiaryRightsOwners', 'b')
			->addSelect('a') // Ensure the associated collections are selected
			->addSelect('w')
			->addSelect('f')
			->addSelect('p')
			->addSelect('b')
			->where('u.id = :id')
			->setParameter('id', $id)
			->getQuery()
			->getResult();
		//dd($user);
		// Render a template with the user data
		return $this->render('nbk/userInfo.html.twig', [
			'pagination' => $user,
		]);
	}

	#[Route('/submit-form/{id}', name: 'submit_form', methods: ['GET'])]
	public function submitForm($id)
	{
        $emailsOfUser = $this->entityManager->getRepository(Emails::class)->findBy([
            'user_id' => $id, 
            'identifier' => 'Branch'
        ]);
		foreach ($emailsOfUser as $email) {
            $email->setStatus('TobeResent'); 
        }
		$this->entityManager->flush();
		
		return new Response('Email sent successfully.');
	}


	public function generatePdf($data)
	{
		$options = new Options();
		$options->set('isHtml5ParserEnabled', true);
		$options->set('isRemoteEnabled', true);
		$dompdf = new Dompdf($options);

		$html = '<html><body>';
		$html .= $this->printKeyValuePairs($data);
		$html .= '</body></html>';
		$dompdf->loadHtml($html);
		$dompdf->render();
		return $dompdf->output();
	}

	public function generateReportPdf(array $data, $time = null, $userreference = null): string
	{
		if (!$time) {
			$time = new DateTime();
		}
		// Define the utf8EncodeArray function correctly
		$utf8EncodeArray = function ($input) use (&$utf8EncodeArray) {
			if (is_array($input)) {
				return array_map($utf8EncodeArray, $input); // Recursively apply utf8_encode
			}
			return $input !== null ? utf8_encode($input) : null;
		};
		// Encode the provided data
		$userreference = $utf8EncodeArray($userreference);
		$user = $utf8EncodeArray($data['user']);
		$address = $utf8EncodeArray($data['address']);
		$workDetails = $utf8EncodeArray($data['workDetails']);
		$beneficiaryRightsOwner = $utf8EncodeArray($data['beneficiaryRightsOwner']);
		$politicalPositionDetails = $utf8EncodeArray($data['politicalPositionDetails']);
		$financialDetails = $utf8EncodeArray($data['financialDetails']);
		// Generate the HTML for the PDF
		$html = $this->renderView('pdf/report.html.twig', [
			'reference' => $userreference,
			'user' => $user,
			'address' => $address,
			'workDetails' => $workDetails,
			'beneficiaryRightsOwner' => $beneficiaryRightsOwner,
			'politicalPositionDetails' => $politicalPositionDetails,
			'financialDetails' => $financialDetails,
			'time' => $time
		]);
		// Set up and render PDF
		$dompdf = new Dompdf();
		$dompdf->set_option('defaultFont', 'Helvetica');
		$dompdf->set_option('isHtml5ParserEnabled', true);
		$dompdf->set_option('isRemoteEnabled', true);
		$dompdf->loadHtml($html);
		$dompdf->render();
		return $dompdf->output();
	}



	public function generateReportPdfForYes(array $data, $time = null, $reference = null): string
	{

		if (!$time) $time = new DateTime();
		// dd($lastUserId);
		$html = $this->renderView('pdf/yesreport.html.twig', [
			'reference' => $reference,
			'user' => $data,
			'time' => $time,
		]);

		$dompdf = new Dompdf();
		$dompdf->loadHtml($html);
		$dompdf->render();

		// Return the PDF content
		return $dompdf->output();
	}

	private function printKeyValuePairs($data)
	{
		$html = '<table style="border-collapse: collapse; width: 100%;">';

		foreach ($data as $key => $value) {
			if (is_array($value)) {
				$uppercaseKey = strtoupper($key);
				$html .= '<tr><td colspan="2" style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>' . $uppercaseKey . '</strong></td></tr>';
				$html .= $this->printKeyValuePairs($value);
			} else {
				$html .= '<tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>' . $key . ':</strong></td>';
				$html .= '<td style="border: 1px solid #ddd; padding: 8px;">' . $value . '</td></tr>';
			}
		}
		$html .= '</table>';
		return $html;
	}

	public function isValidEmail(string $email): bool
	{
		$pattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
		return preg_match($pattern, $email) === 1;
	}
}
