$(function () {
    
    var $year = $('#year');
    var $studyform = $('#studyform');    
    var $cathedra = $('#cathedra');
    var $okr = $('#okr');
    var $proftrain = $('#proftrain');

    const 
        _baseUrl = "http://api-campus-kpi-ua.azurewebsites.net/", 
        //_baseUrl = "http://localhost:64429/", 
        _username = 'mky',
        _password = 'mky';

    var token = "";

    $('.loader').show();
    $.when(getTokenDebug()).done(function(){
        $.ajax({
            url: _baseUrl + "Rnp/Headers",
            type: "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/x-www-form-urlencoded",
                "Authorization" : token
            },
            success: function(data){
                populateRnpHeaders(data);
                $('.loader').hide();
                $( "div.row" ).removeClass( "loading" );
                submitFormListener();
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
    
    function populateRnpHeaders(rnpHeaders) {  
        var Ind = [];
                
        var html = $.map(rnpHeaders.studingYear, function(key, val){
            return '<option value="' + val + '">' + key + '</option>'
        }).join('');
        $year.append(html);
        
        if(rnpHeaders.studingYear.length == 1)
            $year.val(years[0]).change();
        

        var html = $.map(rnpHeaders.studyForm, function(key, val){
            return '<option value="' + val + '">' + key + '</option>'
        }).join('');
        $studyform.append(html);
        
        if(rnpHeaders.studyForm.length == 1)
            $studyform.val(studyform[0]).change();
        
        
        var cathedras = Object.keys(rnpHeaders.profTrain);
        var html = $.map(cathedras, function(val){
            return '<option value="' + val + '">' + val + '</option>'
        }).join('');
        $cathedra.append(html);
        
        if(cathedras.length == 1)
            $cathedra.val(cathedra[0]).change();
        
        
        $cathedra.change(function () {
            $okr.find('option').not(':first').remove();
            $proftrain.find('option').not(':first').remove();
            
            Ind["cathedra"] = $(this).val();
            var okrs = Object.keys( rnpHeaders.profTrain[Ind["cathedra"]] ) || [];     
            var html = $.map(okrs, function(val){
                return '<option value="' + val + '">' + val + '</option>'
            }).join('');
            $okr.append(html);
            
            if(okrs.length == 1)
                $okr.val(okrs[0]).change();
        });
        
        $okr.change(function () {
            $proftrain.find('option').not(':first').remove();
            
            Ind["okr"] = $(this).val();
            var proftrains = rnpHeaders.profTrain[Ind["cathedra"]][Ind["okr"]] || [];   
            var html = $.map(proftrains, function(key, val){
                return '<option value="' + key + '">' + val + '</option>'
            }).join('');
            $proftrain.append(html);
            
            if(proftrains.length == 1)
                $proftrain.val(proftrains[0]).change();
        });
    
    }

    function populateDebugTable(data)
    {
        var debugTable = $('<div class="table-responsive"><table class="tablesorter table table-bordered table-hover" id="debugTable"><thead></thead><tbody></tbody></table>');
        $('body').append(debugTable);

        var tableBody = "";
        $.each( data, function(n, row) {
            tableBody += "<tr>";
            $.each( row, function(k, v) {
                tableBody += "<td>" + v + "</td>";                    
            });   
            tableBody += "</tr>";                         
        }); 
        debugTable.find('tbody').html(tableBody);

        var tableHead = "";
        $.each( data[0], function(k, v) {
                tableHead += "<th><div><span>" + k + "</span></div></th>";                                           
        });
        debugTable.find('thead').html("<tr>" + tableHead + "</tr>"); 

    }

    function submitFormListener()
    {

        $("#NewRnpForm").change(function() {
            var inputError = ($('#excelFile'))[0].files.length == 0
                || isNaN(parseInt($studyform.val())) 
                || isNaN(parseInt($proftrain.val()))
                || isNaN(parseInt($year.val()));

            $(this).find('button[type="submit"]').prop('disabled', inputError);
        });


        $("#NewRnpForm").submit(function(e) {
            e.preventDefault();

            $('.loader').show();
            
            var formData = new FormData();
            formData.append('studingYearId', $year.val());
            formData.append('studyFormId', $studyform.val());
            formData.append('profTrainId', $proftrain.val());
            formData.append('worksheetId', 1);
            formData.append('excelFile', ($('#excelFile'))[0].files[0], 'file.xml');

            var start = new Date().getTime();

            $.ajax({
                url: _baseUrl + "Rnp",
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                headers : {
                    "Accept" : "application/json",
                    "Authorization" : token
                },
                success: function(dataString){
                    var data = JSON.parse(dataString);        
                    populateDebugTable(data);

                    var end = new Date().getTime();              
                    console.log("Time: " + (end - start) + "ms\n\n");               
                    $('.loader').hide();
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);
                    var end = new Date().getTime();              
                    console.log("Time: " + (end - start) + " ms\n\n");               
                    $('.loader').hide();
                }
            });

        });
    }

});