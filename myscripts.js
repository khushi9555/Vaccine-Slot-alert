document.addEventListener('DOMContentLoaded', function() {

    // hiding the no data message on start

    $(function() {
        $("#not_found").hide();
    });

    $(function() {
        $("#date_empty").hide();
    });

    $(function() {
        $("#btn").hide();
    });

    $(function() {
        $("#tab").hide();
    });

    $(function() {
        $("#loading-anmi").hide();
    });

    // Loading animation

    document.querySelector('#submit').onclick = function() {
        $("#loading-anmi").show().delay(1000).fadeOut();


    }

    // Disabling the submit button on start
    document.querySelector('#submit').disabled = true;
    document.querySelector('#btn').disabled = true;

    document.querySelector('#pincode').onkeyup = () => {

        if (document.querySelector('#pincode').value.length == 6) {

            document.querySelector('#submit').disabled = false;
        } else {

            document.querySelector('#submit').disabled = true;
        }
    }


    document.querySelector('form').onsubmit = function() {


        const pincode = document.querySelector('#pincode').value;
        let date = document.querySelector('#date').value;

        // changing format of date 
        date = date.split("-").reverse().join("-");

        // api url
        const api_url = `https: //cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`;

        // Defining async function



        async function getapi(url) {

            // Storing response
            const response = await fetch(url);

            // Storing data in form of JSON
            var res_data = await response.json();

            let flag = 0;


            res_data.sessions.forEach(function(content) {
                if (content.available_capacity_dose1 > 0 && content.available_capacity_dose2 > 0) {
                    flag = 1;
                }
            });

            if (flag == 1) {
                var audio = new Audio('alert.mp3');
                audio.play();
            }

        }



        // enabling the 'Set reminder' button on successfull submit
        document.querySelector('#btn').disabled = false;

        // Calling that async function
        let btn = document.getElementById('btn');
        btn.addEventListener('click', () => {
            setInterval(function() {
                getapi(api_url)
            }, 5000);
            document.querySelector('#btn').disabled = true;

        });


        // fetching data from api 
        fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`)
            .then(response => response.json())
            .then(data => {

                var count1 = 0;
                var count2 = 0;

                // refreshing the table value with null
                var vax = ''
                $("#data").html(vax);

                if (data.errorCode == "USRRES0001") {
                    $(function() {
                        $("#date_empty").show();
                    });

                    $(function() {
                        $("#not_found").hide();
                    });
                    $(function() {
                        $("#tab").hide();
                    });
                    $(function() {
                        $("#btn").hide();
                    });

                } else if (data.sessions == 0 || data.errorCode == "APPOIN0018") {
                    $(function() {
                        $("#not_found").show();
                    });
                    $(function() {
                        $("#tab").hide();
                    });
                    $(function() {
                        $("#btn").hide();
                    });

                    $(function() {
                        $("#date_empty").hide();
                    });

                } else {

                    $(function() {
                        $("#btn").hide();
                    });

                    $(function() {
                        $("#tab").show();
                    });

                    $(function() {
                        $("#not_found").hide();
                    });

                    $(function() {
                        $("#date_empty").hide();
                    });

                    // passing the vaccine data into html table

                    data.sessions.forEach(function(item) {

                        count1 += item.available_capacity_dose1;
                        count2 += item.available_capacity_dose2;

                        vax += `
                        <tr>
                            <td>${item.address}</td>
                            <td>${item.vaccine}</td>
                            <td>${item.available_capacity_dose1}</td>
                            <td>${item.available_capacity_dose2}</td>
                        </tr>
        
                        `
                        $("#data").html(vax);

                    });

                    if (count1 == 0 || count2 == 0) {
                        $(function() {
                            $("#btn").show();
                        });
                    } else {
                        $(function() {
                            $("#btn").hide();
                        });
                    }
                    count = 0;
                }

            }).catch(error => {
                console.log('Error', error);
            });

        return false;
    }
});