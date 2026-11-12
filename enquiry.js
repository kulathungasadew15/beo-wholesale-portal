(function (root) {
  'use strict';
  const products = Object.freeze({
    coconut: { name: 'Pure coconut oil', tag: 'A familiar favourite', description: 'A familiar choice for everyday meals and traditional recipes. Tell us how much coconut oil you need and we can discuss the available options.', specification: 'Ask us about processing, ingredients and packaging if you need a particular specification.' },
    palm: { name: 'Palm oil', tag: 'For your daily preparation', description: 'Explore our palm oil option for your kitchen or business. Share your intended use and approximate quantity when you enquire.', specification: 'The product grade, specification and suitability for your needs will be confirmed with your enquiry.' },
    sunflower: { name: 'Sunflower oil', tag: 'An everyday essential', description: 'Add sunflower oil to your everyday cooking essentials. Enquire about current availability and the quantity that works for you.', specification: 'Ask about the available product specification and pack sizes before confirming your order.' },
    canola: { name: 'Canola oil', tag: 'Light taste. Everyday versatility.', description: 'A mild oil for dressings, baking and commercial cooking. Tell us your required grade and quantity in kg.', specification: 'Confirm refining method, fatty-acid grade, batch specification and bulk delivery availability with your quote.' },
    rbd: { name: 'RBD coconut oil', tag: 'Neutral and refined', description: 'RBD coconut oil is white when solid and clear to pale yellow when liquid, depending on temperature. Tell us the quantity you need and how you plan to use it, and we can discuss the available options.', specification: 'Ask about current product specifications and pack sizes before confirming your order.' }
  });
  function buildEnquiry(data) {
    const selected = data.products.filter(item => Object.hasOwn(products, item.id));
    if (selected.length === 0) throw new Error('Choose at least one oil.');
    const clean = value => String(value || '').trim();
    if (!clean(data.name) || !clean(data.phone)) throw new Error('Name and phone number are required.');
    const lines = [
      'Hello Balangoda Edible Oil Enterprises,',
      'I would like to enquire about the following oils.',
      '',
      'Name: ' + clean(data.name),
      'Phone: ' + clean(data.phone),
      'Buying for: ' + (data.customerType === 'Business' ? 'My business' : 'My home')
    ];
    if (data.customerType === 'Business' && clean(data.business)) lines.push('Business: ' + clean(data.business));
    if (clean(data.area)) lines.push('Town / area: ' + clean(data.area));
    lines.push('', 'Products (sold by kg):');
    for (const item of selected) {
      const quantity = clean(item.quantity);
      if (quantity && (!Number.isFinite(Number(quantity)) || Number(quantity) < 0.1 || Number(quantity) > 1000000)) throw new Error('Please enter a valid quantity.');
      lines.push('• ' + products[item.id].name + ': ' + (quantity ? quantity + ' kg' : 'Quantity in kg to be discussed'));
    }
    if (clean(data.notes)) lines.push('', 'Additional details:', clean(data.notes));
    lines.push('', 'Please confirm availability, pricing, packaging and fulfilment options. Thank you.');
    return lines.join('\n');
  }
  function enquiryLinks(message) {
    return {
      whatsapp: 'https://wa.me/94772358428?text=' + encodeURIComponent(message),
      email: 'mailto:sumids@gmail.com?subject=' + encodeURIComponent('Oil enquiry — Balangoda Edible Oil Enterprises') + '&body=' + encodeURIComponent(message)
    };
  }
  const api = Object.freeze({ products, buildEnquiry, enquiryLinks });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SSOil = api;
})(typeof window !== 'undefined' ? window : globalThis);
