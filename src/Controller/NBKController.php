<?php

namespace App\Controller;

use App\Entity\Users;
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
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Dompdf\Dompdf;
use Dompdf\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class NBKController extends AbstractController
{
    public function __construct(EntityManagerInterface $entityManager, MailerInterface $mailer)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
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

        //real estate
        $imagePartsrealestate = explode(';base64,', $realStateImage);
        $imageBase64realestate = $imagePartsrealestate[1];
        $imageTyperealestate = explode('/', $imagePartsrealestate[0])[1];

        //account statement
        $imagePartsaccountStatement = explode(';base64,', $accountStatementImage);
        $imageBase64accountstatement = $imagePartsaccountStatement[1];
        $imageTypeaccountstatement = explode('/', $imagePartsaccountStatement[0])[1];

        //other doc
        $imagePartsotherDocument = explode(';base64,', $otherDocumentImage);
        $imageBase64otherDocument = $imagePartsotherDocument[1];
        $imageTypeotherDocument = explode('/', $imagePartsotherDocument[0])[1];

        //employee
        $imagePartsemployee = explode(';base64,', $employeeLetterImage);
        $imageBase64employee = $imagePartsemployee[1];
        $imageTypeemployee = explode('/', $imagePartsemployee[0])[1];


        // Prepare the file path
        $fullName = $data['user']['fullName'];
        $mobileNumb = $data['user']['mobileNumb'];
        $folderName = $fullName . '-' . $mobileNumb;
        $imageFolder = 'imageUser/' . str_replace(' ', '_', $folderName);
        $publicDir = $this->getParameter('kernel.project_dir') . '/public/' . $imageFolder;

        if (!file_exists($publicDir)) {
            mkdir($publicDir, 0777, true);
        }
        $imagePath = $publicDir . '/frontImageID.' . $imageType;
        $imageFront = 'imageUser/' . $folderName . '/frontImageID.' . $imageTypeBack;
        $imageBack = 'imageUser/' . $folderName . '/BackimageID.' . $imageTypeBack;
        $imageRealEState = 'imageUser/' . $folderName . '/imageRealEState.' . $imageTyperealestate;
        $imageFrontaccoountStat = 'imageUser/' . $folderName . '/imageFrontaccoountStat.' . $imageTypeaccountstatement;
        $imageotherdoc = 'imageUser/' . $folderName . '/imageotherdoc.' . $imageTypeotherDocument;
        $imageEmployerLetter = 'imageUser/' . $folderName . '/imageEmployerLetter.' . $imageTypeemployee;

        // Decode the base64 data and save the file
        $imageContent = base64_decode($imageBase64);
        $imageContentBack = base64_decode($imageBase64Back);
        $imageContentRealState = base64_decode($imageBase64realestate);
        $imageContentFrontAccountStat = base64_decode($imageBase64accountstatement);
        $imageContentOtherDoc = base64_decode($imageBase64otherDocument);
        $imageContentEmployementLetter = base64_decode($imageBase64employee);

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


        $pdfContent = $this->generatePdf($data);

        $email = (new Email())
            ->from('monitoring@suyool.com')
            ->to($branchEmail)
            ->subject('Form submitted from ' . $data['user']['fullName'])
            ->text('Please find attached the form submitted from ' . $data['user']['fullName'] . '.');
        $email->attach($pdfContent, $data['user']['fullName'] . ' Data.pdf');

        $this->mailer->send($email);

        $email = (new Email())
            ->from('monitoring@suyool.com')
            ->to($data['user']['email'])
            ->subject('Thank you for choosing NBK Lebanon.')
            ->text("Dear " . $data['user']['fullName'] . ",\n\nThank you for choosing NBK Lebanon.\nWe will contact you within 3-5 days.\n\nRegards.");
        $this->mailer->send($email);

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
        $this->submitForm($user->getId());

        return new JsonResponse(['message' => 'Data saved successfully'], Response::HTTP_OK);
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

        $this->submitForm($user->getId());
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
        $branchId = $user->getBranchId();
        $branchEmail = $this->getBranchEmail($branchId);

        // Process your form submission

        // Assuming you have extracted form data, including email recipient and content
        $emailContent = 'To check the user please follow this link https://ubuntunbk.suyool.com/userInfo/' . $id;

        // Create and send the email
        $email = (new Email())
            ->from('monitoring@suyool.com')
            ->to($branchEmail)
            ->subject('Test NBK')
            ->text($emailContent);

        $this->mailer->send($email);

        return new Response('Email sent successfully.');
    }

    public function getBranchEmail($branchId)
    {
        // $branchEmails = [1=>"Sanayehbr@nbk.com.lb", 2=>"Bhamdounbr@nbk.com.lb",3=>"privatebr@nbk.com.lb"];
        //$branchEmails = [1=>"bilal.alkhodor@nbk.com.lb", 2=>"bilal.alkhodor@nbk.com.lb",3=>"bilal.alkhodor@nbk.com.lb"];
        $branchEmails = [1 => "elionajem51@gmail.com", 2 => "eliaschaaya97@gmail.com", 3 => "habchipatrick@gmail.com"];
        if (array_key_exists($branchId, $branchEmails)) {
            return $branchEmails[$branchId];
        } else {
            return null;
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

    //    public function submitForm()
    //    {
    //        // Process your form submission
    //
    //        // Assuming you have extracted form data, including email recipient and content
    //        $recipientEmail = 'elionajem51@gmail.com';
    //        $emailContent = 'This is the email content.';
    //
    //        // Create a new PHPMailer instance
    //        $mail = new PHPMailer(true);
    //
    //        try {
    //            // Server settings
    //            $mail->isSMTP();
    //            $mail->Host = 'mail.nbk.com.lb'; // SMTP server address
    //            $mail->SMTPAuth = true;
    //            $mail->Username = 'noreplyfresh@nbk.com.lb'; // SMTP username
    //            $mail->Password = 'Albarid@rayan123'; // SMTP password
    //            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
    //            $mail->Port = 587; // TCP port to connect to
    //
    //            // Recipients
    //            $mail->setFrom('noreplyfresh@nbk.com.lb', 'Mailer');
    //            $mail->addAddress($recipientEmail);
    //
    //            // Content
    //            $mail->isHTML(true);
    //            $mail->Subject = 'Subject of your email';
    //            $mail->Body    = $emailContent;
    //
    //            $mail->send();
    //            echo 'Message has been sent';
    //        } catch (Exception $e) {
    //            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    //        }
    //
    //        // Redirect or render a response after sending the email
    //    }
}
