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
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class NBKController extends AbstractController
{
    public function __construct(EntityManagerInterface $entityManager,MailerInterface $mailer)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;

    }

    #[Route('/nbk', name: 'app_react')]
    public function index(): Response
    {
        $useragent = $_SERVER['HTTP_USER_AGENT'];
        $_POST['infoString']="Mwx9v3bq3GNGIWBYFJ1f1PcdL3j8SjmsS6y+Hc76TEtMxwGjwZQJHlGv0+EaTI7c";

        if (isset($_POST['infoString'])) {
            $decrypted_string = GenerallServices::decrypt($_POST['infoString']); //['device'=>"aad", asdfsd]
            $suyoolUserInfo = explode("!#!", $decrypted_string);
            $devicetype = stripos($useragent, $suyoolUserInfo[1]);

            if (true) {
                $SuyoolUserId = $suyoolUserInfo[0];
                //$this->session->set('suyoolUserId', $SuyoolUserId);
                // $this->session->set('suyoolUserId', 155);

                $parameters['deviceType'] = $suyoolUserInfo[1];

                return $this->render('nbk/index.html.twig', [
                    'parameters' => $parameters
                ]);
            }
        }

    }
    #[Route('/submit-data', name: 'submitData', methods: ['POST'])]
    public function submit(Request $request, UsersRepository $usersRepository, AddressRepository $addressRepository, WorkDetailsRepository $workDetailsRepository, BeneficiaryRightsOwnerRepository $beneficiaryRepository, PoliticalPositionDetailsRepository $politicalPositionRepository, FinancialDetailsRepository $financialRepository): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }

        // Create and save User entity using UserRepository
        $user = $usersRepository->createUser($data['user']);

        if (!$user) {
            return new JsonResponse(['error' => 'Failed to create user'], Response::HTTP_BAD_REQUEST);
        }

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
        $financialDetails = $financialRepository->createFinancialDetails($data['financialDetails'] ?? []);
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

        $this->submitForm();
        return new JsonResponse(['message' => 'Data saved successfully'], Response::HTTP_OK);
    }

    #[Route('/users', name: 'users_list', methods: ['GET'])]
    public function usersList(Request $request,PaginatorInterface $paginator): Response
    {
        // Fetch all users from the database
        $userRepository = $this->entityManager->getRepository(Users::class);
        $users = $userRepository->createQueryBuilder('u')
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
            ->getQuery();
        //->getResult();

        $pagination = $paginator->paginate(
            $users, // Query to paginate
            $request->query->getInt('page', 1), // Current page number, default to 1
            3 // Items per page
        );
        // Render a template with the user data
        return $this->render('nbk/user_list.html.twig', [
            'pagination' => $pagination,
        ]);
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

        // Render a template with the user data
        return $this->render('nbk/userInfo.html.twig', [
            'pagination' => $user,
        ]);
    }
    public function submitForm()
    {
        // Process your form submission

        // Assuming you have extracted form data, including email recipient and content
        $recipientEmail = 'elionajem51@gmail.com';
        $emailContent = 'This is the email content.';

        // Create and send the email
        $email = (new Email())
            ->from('noreplyfresh@nbk.com.lb')
            ->to($recipientEmail)
            ->subject('Test NBK')
            ->text($emailContent);

        $this->mailer->send($email);

        return new Response('Email sent successfully.');

        // Redirect or render a response after sending the email
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
