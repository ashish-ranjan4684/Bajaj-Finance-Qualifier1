const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

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
