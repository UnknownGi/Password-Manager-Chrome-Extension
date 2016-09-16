$(document).ready(function() {
	var account = [];
	
	$.ajax ({
		url: 'xml/manager.xml',
		dataType: 'xml',
		type: 'get',
		cache: 'false',
		
		success: function ( xml ) {
			$(xml).find('record').each(function(){
				account.push({
					username: $(this).find('username').text(),
					master: $(this).find('master').text()
				});
			});
            
            $('#submitReg').click(function(){
                var found = false;
                for ( i=0; i<account.length && !found; ++i ) {
                    if ( account[i]['username'] == $('#usr').val() ) found = true;
                }
                
                if ( found ) {
                    $('#errorStatus').html('Username Already Exists');
                    $('#usr').val('');
                    $('#pwd').val('');
                }
                else {
                    // :: Write to file
                    
                }
            });
		}
	});
});