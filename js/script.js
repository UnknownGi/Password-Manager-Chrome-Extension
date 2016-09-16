$(document).ready(function(){
    var domain;
    var password = [];
    
    $(function() {
        console.log(localStorage.getItem('username') + ' ' + localStorage.getItem('master'));
        
        if (localStorage.getItem('password') === null)
            localStorage.setItem('password', password);
        if (localStorage.getItem('state') === null) 
            localStorage.setItem('state', 'register');
        
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
            
            console.log(localStorage.getItem(domain));
            console.log(localStorage.getItem(domain+'id'));
            console.log(localStorage.getItem(domain+'pass'));
            console.log(localStorage.getItem(domain+'ekey'));
            
            
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
                localStorage.setItem('master', $('#pwd').val());
                
                localStorage.setItem('state', 'login');
                
                $('#registerPanel').hide();
                $('#userPanel').show();
            }
        } else {
            if ( localStorage.getItem('username') != $('#usr').val() ) console.log("error:: no username exists");
            else {
                if ( localStorage.getItem('master') != $('#pwd').val() ) console.log('error:: master mismatch');
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
        if ( localStorage.getItem('master') == $('#delpwd').val() ) {
            $('#deletePanel').hide();
            $('#registerPanel').show();

            localStorage.reset();
            
            localStorage.setItem('state', 'register');
        } 
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
        localStorage.setItem(domain + 'id', $('#usrname').val());
        localStorage.setItem(domain + 'pass', $('#spwd').val());
        localStorage.setItem(domain + 'ekey', 'none');
        
        $('#not').hide();
        $('#managed').show();
        
        $('#copyUser').val(localStorage.getItem(domain+'id'));
        $('#copyPass').val(localStorage.getItem(domain+'pass'));
        // :: Use Encryption To Save Password
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
        copyToClipboard(document.getElementById("gpwd"));
    });
    
    $('#copyButtonUser').click(function() {
        copyToClipboard(document.getElementById("copyUser"));
    });
    
    $('#copyButtonPass').click(function() {
        copyToClipboard(document.getElementById("copyPass"));
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
        localStorage.setItem(domain + 'id', $('#copyUser').val());
        localStorage.setItem(domain + 'pass', $('#copyPass').val());
        localStorage.setItem(domain + 'ekey', 'none');
        
        $('#copyUser').attr('disabled', true);
        $('#copyPass').attr('disabled', true);
        
        $('#copyButtonUser').show();
        $('#copyButtonPass').show();
        
        $('#change').show();
        $('#saveChange').hide();
    });
});

function copyToClipboard(elem) {
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        target.textContent = "";
    }
    return succeed;
}