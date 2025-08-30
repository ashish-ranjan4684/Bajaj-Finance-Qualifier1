const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

rateLimitBucket = {}

function rateLimiter(req,res,next){
    ip = req.ip;
    if (!rateLimitBucket.ip){
        rateLimitBucket.ip = {windowStart:Date.now(),numberOfRequests:1};
        console.log(ip+"is first time user")
        next();

    }else{
        if(Date.now() - rateLimitBucket.ip.windowStart > 10000){
            rateLimitBucket.ip.windowStart = Date.now();
            rateLimitBucket.ip.numberOfRequests = 1;
            next();
        }else if(rateLimitBucket.ip.numberOfRequests < 2){
            rateLimitBucket.ip.numberOfRequests++;
            console.log("number of requests for ip"+ip+"="+rateLimitBucket.ip.numberOfRequests)
            next();
        }else{
            console.log("request blocked for ip"+ip);
            res.sendStatus(409);
        }
    }
}

app.use(rateLimiter)

app.post("/bhfl", (req, res) => {
    let data = req.body.data;
    let is_success = true;
    let user_id = "john_doe_17091999";
    let roll_number = "ABCD123";
    let email = "john@xyz.com";

    let odd_numbers = [];
    let even_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;
    let concat_string = "";

    for (let i = 0; i < data.length; i++) {
        if (!isNaN(Number(data[i]))) {
            let number = Number(data[i]);
            sum += number;
            if (number % 2 === 0) {
                even_numbers.push(data[i]);
            } else {
                odd_numbers.push(data[i]);
            }
        } else if (
            (data[i].charCodeAt(0) >= 65 && data[i].charCodeAt(0) <= 90) ||
            (data[i].charCodeAt(0) >= 97 && data[i].charCodeAt(0) <= 122)
        ) {
            alphabets.push(data[i].toUpperCase());
            concat_string += data[i];
        } else {
            special_characters.push(data[i]);
        }
    }

    // Reverse string with alternating case
    let reversed_str = "";
    let upperTurn = true;
    for (let i = concat_string.length - 1; i >= 0; i--) {
        if (upperTurn) {
            reversed_str += concat_string[i].toUpperCase();
            upperTurn = false;
        } else {
            reversed_str += concat_string[i].toLowerCase();
            upperTurn = true;
        }
    }

    res.json({
        is_success,
        user_id,
        email,
        roll_number,
        odd_numbers,
        even_numbers,
        alphabets,
        special_characters,
        sum: String(sum),
        concat_string,
        reversed_str
    });
});

app.listen(8080, "0.0.0.0", () => {
    console.log("server listening on port 8080");
});
