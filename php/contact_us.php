<?php

    /* --------=== Begin of Recaptcha Validation ===-------- */
    $captcha;

    if(intval($responseKeys["success"]) !== 1) {
        http_response_code(500);
    } 

    if(isset($_POST['g-recaptcha-response'])){
        $captcha=$_POST['g-recaptcha-response'];
    }

    if(!$captcha){
        http_response_code(403);
        return false;
    }

    $secretKey = "6Lc-1BITAAAAADltKhW24a6N_t4VWi3sJSAoHykk";
    $ip = $_SERVER['REMOTE_ADDR'];
    $response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$captcha."&remoteip=".$ip);
    $responseKeys = json_decode($response,true);

    /* --------=== End of Recaptcha Validation ===-------- */
    

    /* --------=== Begin of Send Contact Form ===-------- */
    // Check for empty fields
    if(empty($_POST['name'])  		||
        empty($_POST['email']) 		||
        empty($_POST['phone']) 		||
        empty($_POST['message'])	||
        !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            return false;
    }
        
    $name = $_POST['name'];
    $email_address = $_POST['email'];
    $phone = $_POST['phone'];
    $message = $_POST['message'];
        
    // Create the email and send the message
    $to = 'joshuaseagle@gmail.com'; // admin@sei.com Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
    $email_subject = "Website Contact Form:  $name";
    $email_body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message";
    $headers = "From: noreply@eagle-js.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
    $headers .= "Reply-To: $email_address";	
    mail($to,$email_subject,$email_body,$headers);
    http_response_code(200);
    return true;	
    /* --------=== End of Send Contact Form ===-------- */		
?>