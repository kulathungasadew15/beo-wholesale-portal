(function () {
  'use strict';
  const { products, buildEnquiry, enquiryLinks } = window.SSOil;
  const form = document.querySelector('#enquiry-form');
  const checkboxes = [...form.querySelectorAll('input[name="oil"]')];
  const productDialog = document.querySelector('#product-dialog');
  const reviewDialog = document.querySelector('#review-dialog');
  const privacyDialog = document.querySelector('#privacy-dialog');
  const nav = document.querySelector('#main-nav');
  const menu = document.querySelector('.menu-toggle');
  const toast = document.querySelector('#toast');
  const oilError = document.querySelector('#oil-error');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedProduct = null;
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
  }
  function closeMenu() {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-wrap')) closeMenu();
  });
  window.matchMedia('(min-width: 741px)').addEventListener('change', closeMenu);

  function openDialog(dialog) {
    closeMenu();
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  [productDialog, reviewDialog, privacyDialog].forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });

  function syncOilChoices() {
    for (const checkbox of checkboxes) {
      const quantity = form.elements.namedItem('qty-' + checkbox.value);
      quantity.disabled = !checkbox.checked;
      checkbox.closest('.oil-row').classList.toggle('selected', checkbox.checked);
    }
    if (checkboxes.some(checkbox => checkbox.checked)) {
      oilError.hidden = true;
      form.querySelector('.oil-selection').classList.remove('has-error');
    }
  }
  function updateEnquirySummary() {
    const chosen = checkboxes.filter(checkbox => checkbox.checked);
    const quantities = chosen.map(checkbox => form.elements.namedItem('qty-' + checkbox.value).value.trim());
    const count = chosen.length;
    const complete = count > 0 && quantities.every(value => value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0.1 && Number(value) <= 1000000);
    let summary = count ? count + (count === 1 ? ' oil selected' : ' oils selected') + ' · Quantities in kg' : 'Choose your oils to start your enquiry.';
    if (complete) {
      const total = quantities.reduce((sum, value) => sum + Number(value), 0);
      summary = count + (count === 1 ? ' oil selected' : ' oils selected') + ' · ' + new Intl.NumberFormat('en', { maximumFractionDigits: 3 }).format(total) + ' kg total';
    }
    document.querySelector('#enquiry-summary').textContent = summary;
  }
  checkboxes.forEach(checkbox => checkbox.addEventListener('change', () => {
    syncOilChoices();
    updateEnquirySummary();
  }));
  form.querySelectorAll('input[name^="qty-"]').forEach(input => input.addEventListener('input', updateEnquirySummary));
  function addProduct(id) {
    const checkbox = checkboxes.find(item => item.value === id);
    if (!checkbox) return;
    checkbox.checked = true;
    syncOilChoices();
    if (productDialog.open) productDialog.close();
    document.querySelector('#enquire').scrollIntoView({ behavior: reduceMotion.matches || document.documentElement.classList.contains('motion-reduced') ? 'instant' : 'smooth', block: 'start' });
    form.elements.namedItem('qty-' + id).focus({ preventScroll: true });
    updateEnquirySummary();
    showToast(products[id].name + ' added. Enter your quantity in kg.');
  }
  document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => addProduct(button.dataset.add)));
  document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.product;
    const product = products[id];
    if (!product) return;
    selectedProduct = id;
    document.querySelector('#product-dialog-tag').textContent = product.tag.toUpperCase();
    document.querySelector('#product-dialog-title').textContent = product.name;
    document.querySelector('#product-dialog-description').textContent = product.description;
    document.querySelector('#product-specification').textContent = product.specification;
    const art = document.querySelector('#dialog-product-art');
    art.className = 'dialog-product-art product-picture ' + id;
    art.setAttribute('aria-label', id === 'rbd' ? 'Illustration of white RBD coconut oil in a glass carafe and bowl' : 'Illustrative ingredients for ' + product.name.toLowerCase());
    openDialog(productDialog);
  }));
  document.querySelector('#dialog-add').addEventListener('click', () => addProduct(selectedProduct));

  function syncCustomerType() {
    const business = form.elements.namedItem('customerType').value === 'Business';
    const field = form.querySelector('.business-field');
    field.hidden = !business;
    field.querySelector('input').disabled = !business;
  }
  form.querySelectorAll('input[name="customerType"]').forEach(input => input.addEventListener('change', syncCustomerType));
  document.querySelector('#business-cta').addEventListener('click', () => {
    form.querySelector('input[name="customerType"][value="Business"]').checked = true;
    syncCustomerType();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = checkboxes.filter(checkbox => checkbox.checked);
    if (!selected.length) {
      oilError.hidden = false;
      form.querySelector('.oil-selection').classList.add('has-error');
      checkboxes[0].focus();
      return;
    }
    const fieldValue = name => form.elements.namedItem(name).value.trim();
    if (!fieldValue('customerName')) {
      form.elements.namedItem('customerName').setCustomValidity('Please enter your name.');
      form.elements.namedItem('customerName').reportValidity();
      return;
    }
    if (!/^[+0-9() .-]{7,30}$/.test(fieldValue('phone')) || fieldValue('phone').replace(/\D/g, '').length < 7) {
      form.elements.namedItem('phone').setCustomValidity('Please enter a phone number with at least 7 digits.');
      form.elements.namedItem('phone').reportValidity();
      return;
    }
    try {
      const message = buildEnquiry({
        name: fieldValue('customerName'), phone: fieldValue('phone'),
        customerType: fieldValue('customerType'), business: fieldValue('businessName'),
        area: fieldValue('area'), notes: fieldValue('notes'),
        products: selected.map(checkbox => ({ id: checkbox.value, quantity: fieldValue('qty-' + checkbox.value) }))
      });
      document.querySelector('#enquiry-preview').value = message;
      const links = enquiryLinks(message);
      document.querySelector('#send-whatsapp').href = links.whatsapp;
      document.querySelector('#send-email').href = links.email;
      document.querySelector('#copy-enquiry').textContent = 'Copy message';
      openDialog(reviewDialog);
    } catch (error) {
      oilError.textContent = error.message;
      oilError.hidden = false;
    }
  });
  ['customerName', 'phone'].forEach(name => form.elements.namedItem(name).addEventListener('input', event => event.target.setCustomValidity('')));
  document.querySelector('#copy-enquiry').addEventListener('click', async event => {
    const preview = document.querySelector('#enquiry-preview');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(preview.value);
      event.target.textContent = 'Copied!';
    } catch {
      preview.focus();
      preview.select();
      event.target.textContent = 'Message selected — copy it';
    }
  });
  document.querySelector('#privacy-button').addEventListener('click', () => openDialog(privacyDialog));
  document.querySelector('#year').textContent = new Date().getFullYear();
  syncOilChoices();
  updateEnquirySummary();
  syncCustomerType();
  form.querySelector('.submit-button').disabled = false;
})();
