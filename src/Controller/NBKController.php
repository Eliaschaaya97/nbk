<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Service\GenerallServices;
class NBKController extends AbstractController
{
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
    #[Route('/test', name: 'app_reacttest')]
    public function indextest(): Response
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
}
