// Integrations Hub - External Service Connections

export const integrationCategories = [
    { id: 'all', name: 'All Integrations', icon: '🔌' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'forms', name: 'Forms', icon: '📧' },
    { id: 'chat', name: 'Live Chat', icon: '💬' },
    { id: 'email', name: 'Email Marketing', icon: '✉️' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'social', name: 'Social Media', icon: '📱' }
]

export const integrations = [
    // ANALYTICS
    {
        id: 'google-analytics',
        name: 'Google Analytics',
        category: 'analytics',
        description: 'Track website traffic and user behavior',
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '5 min',
        requiresApiKey: true,
        apiKeyLabel: 'Measurement ID (G-XXXXXXXXXX)',
        prompt: `Add Google Analytics tracking to the website. 

Instructions:
1. Add this script in the <head> section:
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

2. Replace GA_MEASUREMENT_ID with the actual measurement ID
3. Add a comment: <!-- Google Analytics -->

Keep all existing code intact.`,
        setupInstructions: [
            'Go to analytics.google.com',
            'Create a new property',
            'Copy your Measurement ID (G-XXXXXXXXXX)',
            'Paste it when adding the integration'
        ]
    },
    {
        id: 'plausible',
        name: 'Plausible Analytics',
        category: 'analytics',
        description: 'Privacy-friendly analytics alternative',
        logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '3 min',
        requiresApiKey: true,
        apiKeyLabel: 'Domain (yourdomain.com)',
        prompt: `Add Plausible Analytics tracking to the website.

Instructions:
1. Add this script in the <head> section:
<script defer data-domain="YOUR_DOMAIN" src="https://plausible.io/js/script.js"></script>

2. Replace YOUR_DOMAIN with the actual domain
3. Add a comment: <!-- Plausible Analytics -->

Keep all existing code intact.`,
        setupInstructions: [
            'Go to plausible.io',
            'Add your website',
            'Copy your domain name',
            'Paste it when adding the integration'
        ]
    },

    // FORMS
    {
        id: 'formspree',
        name: 'Formspree',
        category: 'forms',
        description: 'Easy form backend without server code',
        logo: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '5 min',
        requiresApiKey: true,
        apiKeyLabel: 'Form Endpoint (https://formspree.io/f/xxxxx)',
        prompt: `Add Formspree integration to the contact form.

Instructions:
1. Find the contact form in the HTML
2. Update the form tag:
<form action="FORMSPREE_ENDPOINT" method="POST">

3. Add hidden input for subject:
<input type="hidden" name="_subject" value="New contact form submission">

4. Add name attributes to all inputs if missing
5. Replace FORMSPREE_ENDPOINT with the actual endpoint

Keep all existing form styling and structure.`,
        setupInstructions: [
            'Go to formspree.io',
            'Create a new form',
            'Copy your form endpoint URL',
            'Paste it when adding the integration'
        ]
    },
    {
        id: 'google-forms',
        name: 'Google Forms',
        category: 'forms',
        description: 'Embed Google Forms in your website',
        logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '3 min',
        requiresApiKey: true,
        apiKeyLabel: 'Form Embed URL',
        prompt: `Add embedded Google Form to the website.

Instructions:
1. Add this iframe where the form should appear:
<iframe src="GOOGLE_FORM_URL" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

2. Replace GOOGLE_FORM_URL with the actual embed URL
3. Wrap in a container div with proper styling
4. Make it responsive with max-width

Keep all existing code intact.`,
        setupInstructions: [
            'Create a Google Form',
            'Click Send button',
            'Select Embed HTML tab',
            'Copy the iframe src URL',
            'Paste it when adding the integration'
        ]
    },

    // LIVE CHAT
    {
        id: 'crisp',
        name: 'Crisp Chat',
        category: 'chat',
        description: 'Live chat widget for customer support',
        logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '5 min',
        requiresApiKey: true,
        apiKeyLabel: 'Website ID',
        prompt: `Add Crisp live chat widget to the website.

Instructions:
1. Add this script before closing </body> tag:
<script type="text/javascript">
  window.$crisp=[];
  window.CRISP_WEBSITE_ID="WEBSITE_ID";
  (function(){
    d=document;
    s=d.createElement("script");
    s.src="https://client.crisp.chat/l.js";
    s.async=1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
</script>

2. Replace WEBSITE_ID with your actual website ID
3. Add a comment: <!-- Crisp Chat -->

Keep all existing code intact.`,
        setupInstructions: [
            'Go to crisp.chat',
            'Create an account',
            'Add your website',
            'Copy your Website ID',
            'Paste it when adding the integration'
        ]
    },
    {
        id: 'tawk',
        name: 'Tawk.to',
        category: 'chat',
        description: 'Free live chat software',
        logo: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '5 min',
        requiresApiKey: true,
        apiKeyLabel: 'Property ID',
        prompt: `Add Tawk.to live chat widget to the website.

Instructions:
1. Add this script before closing </body> tag:
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/PROPERTY_ID/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>

2. Replace PROPERTY_ID with your actual property ID
3. Add a comment: <!-- Tawk.to Chat -->

Keep all existing code intact.`,
        setupInstructions: [
            'Go to tawk.to',
            'Create an account',
            'Add a property',
            'Copy your Property ID',
            'Paste it when adding the integration'
        ]
    },

    // EMAIL MARKETING
    {
        id: 'mailchimp',
        name: 'Mailchimp',
        category: 'email',
        description: 'Email marketing and newsletter signup',
        logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=100&q=80',
        difficulty: 'medium',
        setupTime: '10 min',
        requiresApiKey: true,
        apiKeyLabel: 'Form Action URL',
        prompt: `Add Mailchimp newsletter signup form to the website.

Instructions:
1. Create a newsletter signup section with this form:
<form action="MAILCHIMP_ACTION_URL" method="post" target="_blank">
  <input type="email" name="EMAIL" placeholder="Enter your email" required>
  <button type="submit">Subscribe</button>
</form>

2. Replace MAILCHIMP_ACTION_URL with your actual form action URL
3. Style the form to match the website design
4. Add success message handling

Keep all existing code intact.`,
        setupInstructions: [
            'Go to mailchimp.com',
            'Create an audience',
            'Create a signup form',
            'Copy the form action URL',
            'Paste it when adding the integration'
        ]
    },
    {
        id: 'convertkit',
        name: 'ConvertKit',
        category: 'email',
        description: 'Email marketing for creators',
        logo: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '5 min',
        requiresApiKey: true,
        apiKeyLabel: 'Form ID',
        prompt: `Add ConvertKit email signup form to the website.

Instructions:
1. Add this script in the <head> section:
<script src="https://f.convertkit.com/FORM_ID/index.js" async></script>

2. Add this div where you want the form:
<div data-convertkit-form="FORM_ID"></div>

3. Replace FORM_ID with your actual form ID
4. Add a comment: <!-- ConvertKit Form -->

Keep all existing code intact.`,
        setupInstructions: [
            'Go to convertkit.com',
            'Create a form',
            'Get the form ID from the embed code',
            'Paste it when adding the integration'
        ]
    },

    // PAYMENTS
    {
        id: 'stripe',
        name: 'Stripe Checkout',
        category: 'payments',
        description: 'Accept payments online',
        logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80',
        difficulty: 'advanced',
        setupTime: '15 min',
        requiresApiKey: true,
        apiKeyLabel: 'Publishable Key (pk_...)',
        prompt: `Add Stripe payment button to the website.

Instructions:
1. Add Stripe.js in the <head> section:
<script src="https://js.stripe.com/v3/"></script>

2. Add a payment button:
<button id="checkout-button">Buy Now</button>

3. Add this script before closing </body>:
<script>
var stripe = Stripe('PUBLISHABLE_KEY');
document.getElementById('checkout-button').addEventListener('click', function() {
  stripe.redirectToCheckout({
    lineItems: [{price: 'PRICE_ID', quantity: 1}],
    mode: 'payment',
    successUrl: window.location.href + '?success=true',
    cancelUrl: window.location.href + '?canceled=true',
  });
});
</script>

4. Replace PUBLISHABLE_KEY and PRICE_ID with actual values
5. Style the button to match the website

Keep all existing code intact.`,
        setupInstructions: [
            'Go to stripe.com',
            'Create a product and price',
            'Copy your publishable key',
            'Copy the price ID',
            'Paste them when adding the integration'
        ]
    },
    {
        id: 'paypal',
        name: 'PayPal Buttons',
        category: 'payments',
        description: 'Accept PayPal payments',
        logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=100&q=80',
        difficulty: 'medium',
        setupTime: '10 min',
        requiresApiKey: true,
        apiKeyLabel: 'Client ID',
        prompt: `Add PayPal payment button to the website.

Instructions:
1. Add PayPal SDK in the <head> section:
<script src="https://www.paypal.com/sdk/js?client-id=CLIENT_ID"></script>

2. Add a container for the button:
<div id="paypal-button-container"></div>

3. Add this script before closing </body>:
<script>
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {value: '10.00'}
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Transaction completed!');
    });
  }
}).render('#paypal-button-container');
</script>

4. Replace CLIENT_ID with your actual client ID
5. Update the amount value

Keep all existing code intact.`,
        setupInstructions: [
            'Go to developer.paypal.com',
            'Create an app',
            'Copy your Client ID',
            'Paste it when adding the integration'
        ]
    },

    // SOCIAL MEDIA
    {
        id: 'facebook-pixel',
        name: 'Facebook Pixel',
        category: 'social',
        description: 'Track conversions and build audiences',
        logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '5 min',
        requiresApiKey: true,
        apiKeyLabel: 'Pixel ID',
        prompt: `Add Facebook Pixel tracking to the website.

Instructions:
1. Add this script in the <head> section:
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=PIXEL_ID&ev=PageView&noscript=1"
/></noscript>

2. Replace PIXEL_ID with your actual pixel ID
3. Add a comment: <!-- Facebook Pixel -->

Keep all existing code intact.`,
        setupInstructions: [
            'Go to facebook.com/business',
            'Open Events Manager',
            'Create a pixel',
            'Copy your Pixel ID',
            'Paste it when adding the integration'
        ]
    },
    {
        id: 'twitter-widget',
        name: 'Twitter Feed',
        category: 'social',
        description: 'Embed Twitter timeline',
        logo: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=100&q=80',
        difficulty: 'easy',
        setupTime: '5 min',
        requiresApiKey: true,
        apiKeyLabel: 'Twitter Username',
        prompt: `Add Twitter timeline widget to the website.

Instructions:
1. Add this where you want the timeline:
<a class="twitter-timeline" href="https://twitter.com/USERNAME?ref_src=twsrc%5Etfw">Tweets by USERNAME</a>

2. Add this script before closing </body>:
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

3. Replace USERNAME with the actual Twitter username
4. Wrap in a container div with proper styling

Keep all existing code intact.`,
        setupInstructions: [
            'Have a Twitter account',
            'Know your Twitter username',
            'Paste it when adding the integration',
            'Customize appearance if needed'
        ]
    }
]

// Get integrations by category
export const getIntegrationsByCategory = (categoryId) => {
    if (categoryId === 'all') return integrations
    return integrations.filter(i => i.category === categoryId)
}

// Search integrations
export const searchIntegrations = (query) => {
    const lowerQuery = query.toLowerCase()
    return integrations.filter(i => 
        i.name.toLowerCase().includes(lowerQuery) ||
        i.description.toLowerCase().includes(lowerQuery) ||
        i.category.toLowerCase().includes(lowerQuery)
    )
}

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
    const colors = {
        easy: 'green',
        medium: 'yellow',
        advanced: 'red'
    }
    return colors[difficulty] || 'yellow'
}
