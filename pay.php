<?php

$url = "https://bestpaymentss.click/api/request/";
$amount = $_POST['count'] * $_POST['price'];
$email = $_POST['email'];
$merchant_order_id = rand(13577888, 99273812);

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$headers = array(
   "Content-Type: application/x-www-form-urlencoded",
);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$data = "amount=$amount&merchant_order_id=$merchant_order_id&use_card_payment=RUB&country=$country&api_key=0e599e3bfe532f7a918d26c995dcb31665810400d279f0181a14111a5a9f5781&success_url=http://dhhfjskl40.temp.swtest.ru/&fail_url=http://dhhfjskl40.temp.swtest.ru/&email=$email&notice_url=https://script.google.com/macros/s/AKfycbxo-RtB8C_ai9FAKGSMZXveuOo3A1xsGZr3BJyEpr0fJLeFKQr_Ui5lXhGH8psPT056/exec";

curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

//for debug only!
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$resp = curl_exec($curl);
curl_close($curl);
var_dump($resp);

?>