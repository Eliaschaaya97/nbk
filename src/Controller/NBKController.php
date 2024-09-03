<?php

namespace App\Controller;

use App\Entity\Address;
use App\Entity\BeneficiaryRightsOwner;
use App\Entity\FinancialDetails;

use App\Entity\PoliticalPositionDetails;
use App\Entity\Users;
use App\Entity\WorkDetails;
use App\Entity\Logs;
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
		$mobileNumb = $data['user']['mobileNumb'];
		$folderName = $fullName . '-' . $mobileNumb;
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
		$folderdirectory = $publicDirectory . $data['user']['fullName'] . "-" . $data['user']['mobileNumb'];
		
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
		$email = (new Email())
			->from('monitoring@suyool.com')
			->to($branchEmail)
			->subject('Form submitted from ' . $data['user']['fullName'])
			->text('Application REF: User-' . $reference . ",\n\nThe customer : ". $data['user']['fullName'] . "\nNumber:  " . $data['user']['mobileNumb'] . "\nEmail:  " . $data['user']['email'] .  "\naccessed on " . $dateEmailFormatted . ' the Mobile Banking Application to submit a new account opening application using SIM Card  ' . $data['user']['mobileNumb'] . '.' . "\n\nPlease contact the customer within 3-5 days since it is a new relation" );

		$email->attach($pdfContent, $data['user']['fullName'] . ' Data.pdf', 'application/pdf');

		foreach ($images as $imagePath) {
			if (file_exists($imagePath)) {
				$imageContent = file_get_contents($imagePath);
				$imageName = basename($imagePath);
				$email->attach($imageContent, $imageName, mime_content_type($imagePath));
			}
		}

		$response = $this->mailer->send($email);

		$email = (new Email())
			->from('monitoring@suyool.com')
			->to($data['user']['email'])
			->subject('Thank you for choosing NBK Lebanon.')
			->text("Dear " . $data['user']['fullName'] . ",\n\nThank you for choosing NBK Lebanon.\nWe will contact you within 3-5 days.\n\nRegards.");
		$this->mailer->send($email);

		$logs = new Logs();

		try {
			$logs->setidentifier("sending");
			$logs->seturl("test");
			$logs->setrequest(json_encode($data));
			$logs->setresponse("Success");
			$logs->setresponseStatusCode(200);
			$this->entityManager->persist($logs);
			$this->entityManager->flush();
			return new JsonResponse('Email sent successfully.');
		} catch (\Exception $error) {
			$logs->setidentifier("sending");
			$logs->seturl("test");
			$logs->setrequest(json_encode($data));
			$logs->setresponse("Fail");
			$logs->setresponseStatusCode(400);
			$this->entityManager->persist($logs);
			$this->entityManager->flush();
			return new JsonResponse('Error sending email.');
		}

		return new JsonResponse(['message' => 'Data saved successfully'], Response::HTTP_OK);
	}

	public function getBranchEmail($branchId)
	{
		// $branchEmails = [1=>"najm.choueiry@elbarid.com", 2=>"najm.choueiry@elbarid.com",3=>"najm.choueiry@elbarid.com"];
		$branchEmails = [1=>"sanayehbr@nbk.com.lb", 2=>"Bhamdounbr@nbk.com.lb",3=>"PrivateBanking@nbk.com.lb"];
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

		$pdfContent = $this->generateReportPdfForYes($data, $time, $reference);
		$branchEmail = $this->getBranchEmail($data['branchId']);

		$email = (new Email())
		->from('monitoring@suyool.com')
		->to($branchEmail)
		->subject('Form submitted from ' . $data['fullName'])
		->text('Application REF: User-' . $reference . ",\n\nThe customer : " . $data['fullName'] . "\nNumber:  " . $data['mobileNumb'] . "\nEmail:  " . $data['email'] .  "\naccessed on " . $dateEmailFormatted . ' the Mobile Banking Application to submit a new account opening application using SIM Card  ' . $data['mobileNumb'] . '.' . "\n\nPlease contact the customer within 3-5 days since he has already a relationship with NBK Lebanon" );

		$email->attach($pdfContent, $data['fullName'] . ' Data.pdf', 'application/pdf');
		$this->mailer->send($email);

		$email = (new Email())
			->from('monitoring@suyool.com')
			->to($data['email'])
			->subject('Thank you for choosing NBK Lebanon.')
			->text("Dear " . $data['fullName'] . ",\n\nThank you for choosing NBK Lebanon.\nWe will contact you within 3-5 days.\n\nRegards.");
		$this->mailer->send($email);

		// $this->submitForm($user->getId());
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
		$user = $this->entityManager->getRepository(Users::class)->findOneBy(['id' => $id]);
		
		$addressEntities = $this->entityManager->createQueryBuilder()
        ->select('a')
        ->from(Address::class, 'a')
        ->where('a.user = :user')
        ->setParameter('user', $user)
		->getQuery()
		->getResult();
		

		$workDetailsEntities = $this->entityManager->createQueryBuilder()
        ->select('w')
        ->from(WorkDetails::class, 'w')
        ->where('w.user = :user')
        ->setParameter('user', $user)
        ->getQuery()
        ->getResult();

		$beneficiaryRightsOwnerEntities = $this->entityManager->createQueryBuilder()
			->select('b')
			->from(BeneficiaryRightsOwner::class, 'b')
			->where('b.user = :user')
			->setParameter('user', $user)
			->getQuery()
			->getResult();

		$politicalPositionDetailsEntities = $this->entityManager->createQueryBuilder()
			->select('p')
			->from(PoliticalPositionDetails::class, 'p')
			->where('p.user = :user')
			->setParameter('user', $user)
			->getQuery()
			->getResult();

		$financialDetailsEntities = $this->entityManager->createQueryBuilder()
			->select('f')
			->from(FinancialDetails::class, 'f')
			->where('f.user = :user')
			->setParameter('user', $user)
			->getQuery()
			->getResult();
		$user = $this->generallServices->convertUserToArray($user);

		//GETTING THE IMAGES
		$publicDirectory = $_SERVER['DOCUMENT_ROOT'] . "/imageUser/";
		$folderdirectory = $publicDirectory . $user['fullName'] . "-" . $user['mobileNumb'];
		
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

		$branchId = $this->entityManager->getRepository(Users::class)->findOneBy(['id' => $id])->getBranchId();
		$branchEmail = $this->getBranchEmail($branchId);

		$dateEmailFormatted =  $this->entityManager->getRepository(Users::class)->findOneBy(['id' => $id])->getCreated()->format('Y-m-d');

		if ($user['mothersName'] !== null)
		{

			$userreference = $this->entityManager->getRepository(Users::class)->findOneBy(['id' => $id])->getId();
			$usercreatedtime = $this->entityManager->getRepository(Users::class)->findOneBy(['id' => $id])->getCreated();


			$addressArray = $this->generallServices->convertAddressToArray($addressEntities);
			$workDetailsArray = $this->generallServices->convertWorkDetailsToArray($workDetailsEntities);
			$beneficiaryRightsOwnerArray = $this->generallServices->convertBeneficiaryRightsOwnerToArray($beneficiaryRightsOwnerEntities);
			$politicalPositionDetailsArray = $this->generallServices->convertPoliticalPositionDetailsToArray($politicalPositionDetailsEntities);
			$financialDetailsArray = $this->generallServices->convertFinancialDetailsToArray($financialDetailsEntities);
			$data = [
				'user' => $user,
				'address' =>  $addressArray,
				'workDetails' =>  $workDetailsArray,
				'beneficiaryRightsOwner' =>  $beneficiaryRightsOwnerArray,
				'politicalPositionDetails' =>  $politicalPositionDetailsArray,
				'financialDetails' =>  $financialDetailsArray
			];
			$pdfContent = $this->generateReportPdf($data, $usercreatedtime, $userreference);

			$emailContent = "The customer : ". $data['user']['fullName'] . "\nNumber:  " . $data['user']['mobileNumb'] . "\nEmail:  " . $data['user']['email'] .  "\naccessed on " . $dateEmailFormatted . ' the Mobile Banking Application to submit a new account opening application using SIM Card  ' . $data['user']['mobileNumb'] . '.' . "\n\nPlease contact the customer within 3-5 days since it's a new relation";

			$email = (new Email())
				->from('monitoring@suyool.com')
				->to($branchEmail)
				->subject('Form submitted from ' . $data['user']['fullName'])
				->text($emailContent);

			$email->attach($pdfContent, $data['user']['fullName'] . ' Data.pdf', 'application/pdf');
			foreach ($images as $imagePath) {
				if (file_exists($imagePath)) {
					$imageContent = file_get_contents($imagePath);
					$imageName = basename($imagePath);
					$email->attach($imageContent, $imageName, mime_content_type($imagePath));
				}
			}
		}else {
			$userreference = $this->entityManager->getRepository(Users::class)->findOneBy(['id' => $id])->getId();

			$usercreatedtime = $this->entityManager->getRepository(Users::class)->findOneBy(['id' => $id])->getCreated();
			$data = [
				$this->generallServices->convertOnlyUserYesToArray($user),
			];

			$pdfContent = $this->generateReportPdfForYes($data[0], $usercreatedtime, $userreference);


			$emailContent = "The customer : " . $data[0]['fullName'] . "\nNumber:  " . $data[0]['mobileNumb'] . "\nEmail:  " . $data[0]['email'] .  "\naccessed on " . $dateEmailFormatted . ' the Mobile Banking Application to submit a new account opening application using SIM Card  ' . $data[0]['mobileNumb'] . '.' . "\n\nPlease contact the customer within 3-5 days since he has already a relationship with NBK Lebanon at " . $data[0]['branchUnit'] ;

			// Create and send the email
			$email = (new Email())
				->from('monitoring@suyool.com')
				->to($branchEmail)
				->subject('Form submitted from ' . $data[0]['fullName'])
				->text($emailContent);
	
			$email->attach($pdfContent, $data[0]['fullName'] . ' Data.pdf', 'application/pdf');
		}

		$response = $this->mailer->send($email);

		$logs = new Logs();

		try {
			$logs->setidentifier("sending");
			$logs->seturl("test");
			$logs->setrequest(json_encode($data));
			$logs->setresponse("Success");
			$logs->setresponseStatusCode(200);
			$this->entityManager->persist($logs);
			$this->entityManager->flush();
			return new Response('Email sent successfully.');
		} catch (\Exception $error) {
			$logs->setidentifier("sending");
			$logs->seturl("test");
			$logs->setrequest(json_encode($data));
			$logs->setresponse("Fail");
			$logs->setresponseStatusCode(400);
			$this->entityManager->persist($logs);
			$this->entityManager->flush();
			return new Response('Error sending email.');
		}
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

		if (!$time) $time = new DateTime();
		// dd($userreference);
		$html = $this->renderView('pdf/report.html.twig', [
			'reference' =>  $userreference ,
			'user' => $data['user'],
			'address' => $data['address'],
			'workDetails' => $data['workDetails'],
			'beneficiaryRightsOwner' => $data['beneficiaryRightsOwner'],
			'politicalPositionDetails' => $data['politicalPositionDetails'],
			'financialDetails' => $data['financialDetails'],
			'time' => $time
		]);
		// dd($html);
		// Generate PDF
		$dompdf = new Dompdf();
		$dompdf->loadHtml($html);
		$dompdf->render();

		// Return the PDF content
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
