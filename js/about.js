//Logo link
document.getElementById('logo').addEventListener('click', function() {
    window.location.href = 'index.html';
});

//Share button
document.getElementById('share').addEventListener('click', function(event) {
    event.preventDefault();
  
    // The main domain to be shared
    const mainDomain = 'https://www.storymoji.online';
  
    // Track the event with GA4 before the share functionality
    gtag('event', 'Header Share Click', {
      'event_category': 'Button Clicks',
      'event_label': 'Header Share Click'
    });
  
    // Function to check if the device is mobile
    function isMobileDevice() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }
  
    // If it's a mobile device and the share API is supported, use the native share modal
    if (isMobileDevice() && navigator.share) {
        navigator.share({
            title: document.title,
            url: mainDomain // Share the main domain
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        // For non-mobile devices, use the existing clipboard functionality
        navigator.clipboard.writeText(mainDomain).then(function() { // Copy the main domain
            var linkCopied = document.getElementById('linkCopied');
            linkCopied.classList.add('active');
            setTimeout(function() {
                linkCopied.classList.remove('active');
            }, 1000); // Duration for the message display
        }, function(err) {
            console.error('Could not copy text:', err);
        });
    }
  });
  