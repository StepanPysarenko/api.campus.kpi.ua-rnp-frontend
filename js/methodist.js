jQuery(function ($) {

    const 
        _baseUrl = "http://api-campus-kpi-ua.azurewebsites.net/", 
        //_baseUrl = "http://localhost:64429/", 
        _username = 'mky',
        _password = 'mky';

    var token = "";

    $('.loader').show();
    $.when(getTokenDebug()).done(function(){
        $.ajax({
            url: _baseUrl + "Rnp/Filters",
            type: "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/x-www-form-urlencoded",
                "Authorization" : token
            },
            success: function(data){
                populateRnpFilters(data);
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
   
    function populateRnpTable(rnpRows)
    {
        var appendString = "";
        var i = 1;
        $.each( rnpRows.rows, function(key, val) {
            appendString += "<tr><td>"
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
                + (val.exam == 1 ? "+" : "") + "</td><td>" 
                + (val.test == 1 ? "+" : "") + "</td><td>" 
                + (val.difftest == 1 ? "+" : "") + "</td><td>" 
                + (val.controlworks == 1 ? "+" : "") + "</td><td>" 
                + (val.courseproject == 1 ? "+" : "") + "</td><td>" 
                + (val.coursework == 1 ? "+" : "") + "</td><td>" 
                + (val.rgr == 1 ? "+" : "") + "</td><td>" 
                + (val.dkr == 1 ? "+" : "") + "</td><td>" 
                + (val.essay == 1 ? "+" : "") +"</td><td>"
                + val.type
                + "</td></tr>";          
        });
        
        $('tbody').html(appendString);

        //var tableHead = '<tr><th rowspan="2">№</th><th rowspan="2">Семестр</th>            <th rowspan="2">Найменування кредитного модулю</th>            <th rowspan="2">Назва кафедри</th>            <th colspan="2">Обсяг дисциплін</th>            <th colspan="4">Аудиторні години</th>            <th colspan="9">Контрольні заходи</th>            <th rowspan="2" class="tdwidth">Цикл</th>        </tr>        <tr>            <th rowspan="2" class="vertical">Кредитів ECTS</th>            <th rowspan="2" class="vertical">Годин</th>            <th id="theadHeight" class="vertical">Лекцій</th>            <th class="vertical">Практик</th>            <th id="theadHeight" class="vertical">Лабораторних робіт</th>            <th class="vertical">Самостійної роботи</th>            <th rowspan="2" class="vertical">Екзамен</th>            <th rowspan="2" class="vertical">Залік</th>            <th rowspan="2" class="vertical">Дифер.   залік</th>            <th rowspan="2" class="vertical">Модульні контрольні роботи</th>            <th rowspan="2" class="vertical">Курсові проекти</th>            <th rowspan="2" class="vertical">Курсові роботи</th>            <th rowspan="2">РГР</th>            <th rowspan="2">ДКР</th>            <th rowspan="2" class="vertical tdwidth">Реферати</th>        </tr>'
        var tableHead = '<tr><th class="sized" rowspan="2">№</th><th class="sized" rowspan="2">Семестр</th>            <th class="sized" rowspan="2">Найменування кредитного модулю</th>            <th class="sized" rowspan="2">Назва кафедри</th>            <th colspan="2">Обсяг дисциплін</th>            <th colspan="4">Аудиторні години</th>            <th colspan="9">Контрольні заходи</th>            <th class="sized" rowspan="2" class="tdwidth">Цикл</th>        </tr>        <tr>            <th class="sized" rowspan="2" class="vertical">Кредитів ECTS</th>            <th class="sized" rowspan="2" class="vertical">Годин</th>            <th class="sized" id="theadHeight" class="vertical">Лекцій</th>            <th class="sized" class="vertical">Практик</th>            <th class="sized" id="theadHeight" class="vertical">Лабораторних робіт</th>            <th class="sized" class="vertical">Самостійної роботи</th>            <th class="sized" rowspan="2" class="vertical">Екзамен</th>            <th class="sized" rowspan="2" class="vertical">Залік</th>            <th class="sized" rowspan="2" class="vertical">Дифер.   залік</th>            <th class="sized" rowspan="2" class="vertical">Модульні контрольні роботи</th>            <th class="sized" rowspan="2" class="vertical">Курсові проекти</th>            <th class="sized" rowspan="2" class="vertical">Курсові роботи</th>            <th class="sized" rowspan="2">РГР</th>            <th class="sized" rowspan="2">ДКР</th>            <th class="sized" rowspan="2" class="vertical tdwidth">Реферати</th>        </tr>'
        
        $('thead').html(tableHead);        
    }  
    
    function clearRnpTable()
    {
        $('tbody').html("");
        $('thead').html("");  
    }     
    
    
    function populateRnpFilters(rnpFilters)
    {  
        var $year = $('#year');
        var $cathedra = $('#cathedra');
        var $okr = $('#okr');
        var $proftrain = $('#proftrain');
        var $studyform = $('#studyform');    
        var Ind = [];
        
        var years = Object.keys(rnpFilters);
        var html = $.map(years, function(val){
            return '<option value="' + val + '">' + val + '</option>'
        }).join('');
        $year.append(html);
        
        if(years.length == 1)
            $year.val(years[0]).change();
        
        $year.change(function () {
            $cathedra.find('option').not(':first').remove();
            $okr.find('option').not(':first').remove();
            $proftrain.find('option').not(':first').remove();
            $studyform.find('option').not(':first').remove();
            
            Ind["year"] = $(this).val();
            var cathedras = Object.keys( rnpFilters[Ind["year"]] ) || []; 
            var html = $.map(cathedras, function(val){
                return '<option value="' + val + '">' + val + '</option>'
            }).join('');
            $cathedra.append(html);
            
            if(cathedras.length == 1)
                $cathedra.val(cathedras[0]).change();
        });
        
        $cathedra.change(function () {
            $okr.find('option').not(':first').remove();
            $proftrain.find('option').not(':first').remove();
            $studyform.find('option').not(':first').remove();
            
            Ind["cathedra"] = $(this).val();
            var okrs = Object.keys( rnpFilters[Ind["year"]][Ind["cathedra"]] ) || [];     
            var html = $.map(okrs, function(val){
                return '<option value="' + val + '">' + val + '</option>'
            }).join('');
            $okr.append(html);
            
            if(okrs.length == 1)
                $okr.val(okrs[0]).change();
        });
        
        $okr.change(function () {
            $proftrain.find('option').not(':first').remove();
            $studyform.find('option').not(':first').remove();
            
            Ind["okr"] = $(this).val();
            var proftrains = Object.keys( rnpFilters[Ind["year"]][Ind["cathedra"]][Ind["okr"]] ) || [];   
            var html = $.map(proftrains, function(val){
                return '<option value="' + val + '">' + val + '</option>'
            }).join('');
            $proftrain.append(html);
            
            if(proftrains.length == 1)
                $proftrain.val(proftrains[0]).change();
        });
        
        $proftrain.change(function () {
            $studyform.find('option').not(':first').remove();
            
            Ind["proftrain"] = $(this).val();
            var studyforms = Object.keys( rnpFilters[Ind["year"]][Ind["cathedra"]][Ind["okr"]][Ind["proftrain"]] ) || []; 
            var html = $.map(studyforms, function(val){
                return '<option value="' + val + '">' + val + '</option>'
            }).join('');
            $studyform.append(html);
            
            if(studyforms.length == 1)
                $studyform.val(studyforms[0]).change();
        });

        $studyform.change(function () {      
            Ind["studyform"] = $(this).val();

            var resultId = rnpFilters[Ind["year"]][Ind["cathedra"]][Ind["okr"]][Ind["proftrain"]][Ind["studyform"]];

            if(Ind["studyform"] != "-")
            {
                $.ajax({
                    url: _baseUrl + "Rnp/" + resultId,
                    type: "GET",
                    headers : {
                        "Accept" : "application/json",
                        "Content-Type" : "application/x-www-form-urlencoded",
                        "Authorization" : token
                    },
                    success: function(rnpRows){
                        populateRnpTable(rnpRows);         
                    }
                });
            }
            else
            {
                clearRnpTable();
            }
     
        });
    
    }

});