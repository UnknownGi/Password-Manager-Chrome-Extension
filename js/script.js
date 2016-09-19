$(document).ready(function(){
    var domain;
    var password = [];
    
    $(function() {
        localStorage.clear();
        
        $('#alertMsg').hide();
        if (localStorage.getItem('username') === null) 
            $('#alertMsg').show();
        if (localStorage.getItem('password') === null)
            localStorage.setItem('password', password);
        if (localStorage.getItem('state') === null) 
            localStorage.setItem('state', 'register');
        if (localStorage.getItem('ekey') === null) 
            localStorage.setItem('ekey', '<pP10d%dk;al![2089]$ah!r');
        
        if (localStorage.getItem('username') !== null ) {
            console.log('Username: ' + localStorage.getItem('username') + '\nEncrypted Master: ' + localStorage.getItem('master'));
            console.log('Real Password: ' + GibberishAES.dec(localStorage.getItem('master'), localStorage.getItem('ekey')));
            console.log('SJCL Encrypt: ' + sjcl.encrypt(localStorage.getItem('ekey'), localStorage.getItem('master')));
            console.log('SJCL Decrypt: ' + sjcl.decrypt(localStorage.getItem('ekey'), sjcl.encrypt(localStorage.getItem('ekey'), localStorage.getItem('master'))));
        }
        
        if (localStorage.getItem('state') == 'register') {
            $('#registerPanel').show();
            $('#deletePanel').hide();
            $('#userPanel').hide();
        } else if (localStorage.getItem('state') == 'delete') {
            $('#registerPanel').hide();
            $('#deletePanel').show();
            $('#userPanel').hide();
        } else if (localStorage.getItem('state') == 'login') {
            $('#registerPanel').hide();
            $('#deletePanel').hide();
            $('#userPanel').show();
        }
        
        $('#saveChange').hide();
        
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url;
    
            if (url.indexOf("://") > -1) domain = url.split('/')[2];
            else domain = url.split('/')[0];
    
            domain = domain.split(':')[0];
            $('#site').val(domain);
            
            console.log('Domain: ' + localStorage.getItem(domain));
            console.log('ID: ' + localStorage.getItem(domain+'id'));
            console.log('Pass: ' + localStorage.getItem(domain+'pass'));
            console.log('Ekey: ' + localStorage.getItem(domain+'ekey'));
            
            
            if (localStorage.getItem(domain+'id') === null) {
                $('#not').show();
                $('#managed').hide();
            } else {
                $('#not').hide();
                $('#managed').show();
                
                $('#copyUser').val(localStorage.getItem(domain+'id'));
                $('#copyPass').val(localStorage.getItem(domain+'pass'));
            }
        });
    });
    
    // :: function
    // :: Login Account
    // Description: Checks credentials and logs into password manager
    $('#loginButton').click(function(){
        if (localStorage.getItem('username') === null) {
            if ( $('#usr').val().length == 0 || $('#pwd').val().length == 0 ) console.log('error:: username or master missing');
            else {
                localStorage.setItem('username', $('#usr').val());
                
                // :: ENCRYTING
                var aes = GibberishAES.enc($('#pwd').val(), localStorage.getItem('ekey'));
                var epass = sjcl.encrypt(localStorage.getItem('ekey'), aes);
                localStorage.setItem('master', epass);
                
                localStorage.setItem('state', 'login');
                
                console.log('aes: ' + aes + '\nepass: ' + epass);
                console.log('Master: ' + localStorage.getItem('master'));
                console.log('decrypt: ' + sjcl.decrypt(localStorage.getItem('ekey'), localStorage.getItem('master')));
                
                $('#alertMsg').hide();
                $('#registerPanel').hide();
                $('#userPanel').show();
            }
        } else {
            // :: DECRYTING
            var emsg = sjcl.decrypt(localStorage.getItem('ekey'), localStorage.getItem('master'));
            var epwd = GibberishAES.enc($('#pwd').val(), localStorage.getItem('ekey'));
            
            if ( GibberishAES.dec(emsg, localStorage.getItem('ekey')) != GibberishAES.dec(epwd, localStorage.getItem('ekey')) )   
            console.log('Decrypt Master: ' + emsg + '\nEncrypt Pass: ' + epwd);
            else console.log('Decrypt Master: ' + emsg + '\nEncrypt Pass: ' + emsg);
            
            if ( localStorage.getItem('username') != $('#usr').val() ) console.log("error:: no username exists");
            else {
                if ( GibberishAES.dec(emsg, localStorage.getItem('ekey')) != GibberishAES.dec(epwd, localStorage.getItem('ekey')) )     console.log('error:: master mismatch');
                else {
                    $('#registerPanel').hide();
                    $('#userPanel').show();
                    
                    localStorage.setItem('state', 'login');
                }
            }
        }
    });
    
    // :: function
    // :: Delete Button
    // Description: Changes from register to delete state
    $('#deleteButton').click(function() {
        if (localStorage.getItem('username') === null) {
            alert('No Account Registered');
        } else {
            $('#registerPanel').hide();
            $('#deletePanel').show();
            
            localStorage.setItem('state', 'delete');
        }
    });
    
    // :: function
    // :: Don't Delete
    // Description: Doesn't delete account and returns back to register state
    $('#no').click(function() {
        $('#deletePanel').hide();
        $('#registerPanel').show();
        
        localStorage.setItem('state', 'register');
    });
    
    // :: function
    // :: Delete Account
    // Description: deletes all accounts and passwords for current user
    $('#yes').click(function() {
        var emsg = sjcl.decrypt(localStorage.getItem('ekey'), localStorage.getItem('master'));
        if ( GibberishAES.dec(emsg, localStorage.getItem('ekey')) == $('#delpwd').val() ) {
            $('#deletePanel').hide();
            $('#registerPanel').show();

            localStorage.clear();
            
            localStorage.setItem('state', 'register');
            localStorage.setItem('ekey', '<pP10d%dk;al![2089]$ah!r');
            
            $('#alertMsg').show();
        } else alert('error:: invalid pass');
    });
    
    // :: function
    // :: Logout
    // Description: Logs out of current account
    $('#logout').click(function() {
        $('#userPanel').hide();
        $('#registerPanel').show();
        
        localStorage.setItem('state', 'register');
    });
    
    // :: function
    // :: Slider Change
    // Description: update slider value on #pLen element
    $('input[name=plength]').change(function() {
        $('#pLen').text($('input[name=plength]').val());
    });
    
    // :: function
    // :: Save Password
    // Description: Saves Password For a Particular Website using Encryption Techniques
    $('#save').click(function() {
        if ( $('#usrname').val().length == 0 || $('#spwd').val().length == 0 ) console.log('error:: username or password missing');
        else { 
            localStorage.setItem(domain + 'id', $('#usrname').val());
            
            var ekey = pseudoRandom();
            localStorage.setItem(domain + 'ekey', ekey);

            var enc = GibberishAES.enc($('#spwd').val(), ekey);
            localStorage.setItem(domain + 'pass', enc);

            console.log('User: ' + $('#usrname').val() + '\nEnc: ' + enc + '\nKey: ' + ekey + '\nDec: ' + GibberishAES.dec(enc, ekey));

            $('#not').hide();
            $('#managed').show();

            $('#copyUser').val(localStorage.getItem(domain+'id'));
            $('#copyPass').val(localStorage.getItem(domain+'pass'));
        } 
    });
    
    // :: function
    // :: Password Generator
    // Description: Generates Password According to checked Checkboxes and Specified Length
    $('#generate').click(function() {
        var array = [];
        
        var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        for (i=0; i<alphabet.length; ++i) array.push(alphabet[i]);
        
        if ( $('input[name=upper]').is(':checked') ) {
            var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            for (i=0; i<alphabet.length; ++i) array.push(alphabet[i]);
        }
        
        if ( $('input[name=numeric]').is(':checked') ) {
            var number = '0123456789'.split('');
            for (i=0; i<number.length; ++i) array.push(number[i]);
        }
        
        if ( $('input[name=spChar]').is(':checked') ) {
            var special = '!@#$%^&*(){}][:;><,.]'.split('');
            for (i=0; i<special.length; ++i) array.push(special[i]);
        }
        
        var pass = "";
        for (i=0; i<parseInt($('input[name=plength]').val()); ++i) {
            pass += array[Math.floor(Math.random() * array.length)];
        } 
        
        $('#gpwd').val(pass);
    });
    
    // :: function
    // :: Copy to Clipboard
    // Description: Copies password generated by password gen to buffer
    $('#copyButtonGen').click(function() {
        copyToClipboard(document.getElementById("gpwd"), domain, 0);
    });
    
    $('#copyButtonUser').click(function() {
        copyToClipboard(document.getElementById("copyUser"), domain, 0);
    });
    
    $('#copyButtonPass').click(function() {
        copyToClipboard(document.getElementById("copyPass"), domain, 1);
    });
    
    // :: function
    // :: Change Credentials
    // Description: Changes Credential for a website 
    $('#change').click(function() {
        $('#copyUser').attr('disabled', false);
        $('#copyPass').attr('disabled', false);
        
        $('#copyButtonUser').hide();
        $('#copyButtonPass').hide();
        
        $('#change').hide();
        $('#saveChange').show();
    });
    
    // :: function
    // :: Save Password
    // Description: Overwrites Password For a Particular Website using Encryption Techniques
    $('#saveChange').click(function() {
        if ( $('#copyUser').val().length == 0 || $('#copyPass').val().length == 0 ) console.log('error:: username or master missing');
        else {
            localStorage.setItem(domain + 'id', $('#copyUser').val());
    
            var ekey = pseudoRandom();
            localStorage.setItem(domain + 'ekey', ekey);

            var ency = GibberishAES.enc($('#copyPass').val(), ekey);
            localStorage.setItem(domain + 'pass', ency);

            console.log('User: ' + $('#copyUser').val() + '\nEnc: ' + ency + '\n' + ekey + '\nDec: ' + GibberishAES.dec(ency, ekey));

            $('#copyUser').val(localStorage.getItem(domain+'id'));
            $('#copyPass').val(localStorage.getItem(domain+'pass'));

            $('#copyUser').attr('disabled', true);
            $('#copyPass').attr('disabled', true);

            $('#copyButtonUser').show();
            $('#copyButtonPass').show();

            $('#change').show();
            $('#saveChange').hide();
        }
    });
});

function copyToClipboard(elementId, domain, val) {  
    var aux = document.createElement("input");
    
    if ( val == 0 ) aux.setAttribute("value", $('#' + elementId.id).val());
    else aux.setAttribute("value", GibberishAES.dec($('#' + elementId.id).val(), localStorage.getItem(domain + 'ekey')));
    
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");

    document.body.removeChild(aux);
}

function pseudoRandom() {
    var array = [];
        
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    for (i=0; i<alphabet.length; ++i) array.push(alphabet[i]);
    
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (i=0; i<alphabet.length; ++i) array.push(alphabet[i]);
    
    var number = '0123456789'.split('');
    for (i=0; i<number.length; ++i) array.push(number[i]);
        
        
    var special = '!@#$%^&*(){}][:;><,.]'.split('');
    for (i=0; i<special.length; ++i) array.push(special[i]);
    
        
    var pass = "";
    for (i=0; i<16; ++i) {
        pass += array[Math.floor(Math.random() * array.length)];
    } 
    
    return pass;
}