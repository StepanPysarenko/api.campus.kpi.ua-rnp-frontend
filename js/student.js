$(function () {

    const 
        _baseUrl = "http://api-campus-kpi-ua.azurewebsites.net/", 
        //_baseUrl = "http://localhost:64429/", 
        _username = '11ovv4422',
        _password = '123test$%^789)';

    var token = "";

    $('.loader').show();
    $.when(getTokenDebug()).done(function(){
        $.ajax({
            url: _baseUrl + "Rnp/Student",
            type: "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/x-www-form-urlencoded",
                "Authorization" : token
            },
            success: function(data){
                populateTables(data);
                $('.loader').hide();
                $( "div.row" ).removeClass( "loading" );
            },
        });
    });
    

    function getTokenDebug() // use only for debugging
    {
        return $.ajax({
            url: _baseUrl + "oauth/token",
            type: "POST",
            data : {
                Username : _username,
                Password : _password,
                Grant_type : "password"
            },
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/x-www-form-urlencoded",
            },
            success: function(data){
                token = data.token_type + " " + data.access_token;
            },
        });
    }
    
    function populateTables(rnpData)
    {
        $('span#cathedra').html(rnpData.cathedra);   
        $('span#okr').html(rnpData.okr);
        $('span#proftrain').html(rnpData.proftrain);
        $('span#studyform').html(rnpData.studyform);
        
        var tableHead = '<tr><th rowspan="2">№</th><th rowspan="2">Семестр</span></th><th rowspan="2">Найменування кредитного модулю</th><th rowspan="2">Назва кафедри</th><th colspan="2">Обсяг дисциплін</th><th colspan="4">Аудиторні години</th><th rowspan="3">Контрольний захід</th><th rowspan="3">Цикл</th></tr><tr><th rowspan="2" class="vertical">Кредитів ECTS</th><th rowspan="2" class="vertical">Годин</th><th id="theadHeight"class="vertical">Лекцій</th><th class="vertical">Практик</th><th id="theadHeight" class="vertical">Лабораторних<br> робіт</th><th class="vertical">Самостійної<br> роботи</th></tr>';
        var nextTab = 1;
        
        $.each( rnpData.rnp, function(year, rows) {
            $('<li><a href="#tab'+nextTab+'" data-toggle="tab">'+year+'</a></li>').appendTo('#tabs');

            $('<div class="tab-pane fade in active" id="tab'+(nextTab++)+'"><div class="table-responsive"><table class="tablesorter table table-bordered table-hover"><thead></thead><tbody></tbody></table></div></div>').appendTo('.tab-content');        

            var i = 1;
            var tableRows = ""
            $.each( rows, function(key, val) {
                tableRows += "<tr><td>"
                + (i++) + "</td><td>"
                + val.semestr +"</td><td>"
                + val.name + "</td><td>" 
                + val.subdivision + "</td><td>" 
                + val.credits + "</td><td>"
                + val.hours + "</td><td>" 
                + val.lecture + "</td><td>" 
                + val.practice + "</td><td>" 
                + val.laboratory + "</td><td>" 
                + val.independentwork + "</td><td>" 
                + (val.exam == 1 ? "Екзамен" : (val.difftest == 1 ? "Диф. залік" : (val.test == 1 ? "Залік" : "-"))) + "</td><td>" 
                + val.type
                + "</td></tr>";          
            });
            
            $table = $('.tab-content div:last table');
            $table.find('tbody').html(tableRows);
            $table.find('thead').html(tableHead);            
            
        }); 
        
        $('#tabs a:first').tab('show');
        
        $(document).ready(function() 
            { 
                $("table").tablesorter(); 
            } 
        );
        
    }
    
    $('#tabs a:first').tab('show');



});

