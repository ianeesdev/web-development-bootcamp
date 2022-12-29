<?php

    // QUESTION # 01
    $firstName = "Muhammad";
    $lastName = "Anees";
    echo "My name is $firstName $lastName";

    $regNo = 45;
    echo "<br> My registration number is $regNo.";

    $courses = array("WT", "DE", "IPE", "DAA", "DS");
    echo "<br> My registered courses are " . $courses[0] . ", " . $courses[1] . ", " . $courses[2] . ", " . $courses[3] . " and " . $courses[4] . ".";

    $matricPercentage = 88.1;
    $interPercentage = 88.3;
    echo "<br> My matric percentage is $matricPercentage and my intermediate percentage is $interPercentage.";



    // QUESTION # 02
    $givenList = array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    $sum = 0;
    for ($x = 0; $x < count($givenList); $x++) {
        if ($givenList[$x] > 1) {
            $is_prime_no = true;
            for ($j = 2; $j <= ($givenList[$x] / 2); $j++) {
                if ($givenList[$x] % $j == 0) {
                    $is_prime_no = false;
                    break;
                }
            }
            if ($is_prime_no) {
                $sum += $givenList[$x];
            }
        }
    }
    echo "<br> Sum of prime numbers is " . $sum;


    
    // QUESTION # 03
    // Set the number of rows in the pyramid
    $rows = 7;

    // Loop through the rows
    for ($i = 1; $i <= $rows; $i++) {
        // Print the necessary number of spaces to align the numbers
        for ($j = 1; $j <= $rows - $i; $j++) {
            echo "&nbsp&nbsp&nbsp&nbsp&nbsp";
        }
        // Print the numbers for this row
        for ($j = 1; $j <= $i; $j++) {
            echo pow(2, $j - 1) . "&nbsp&nbsp&nbsp";
        }
        // Print the numbers in reverse order for this row
        for ($j = $i - 1; $j >= 1; $j--) {
            echo pow(2, $j - 1) . "&nbsp&nbsp&nbsp";
        }
        // Move to the next line
        echo "<br>";
    }

?>