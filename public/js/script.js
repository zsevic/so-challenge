const REGISTRATION_FORM = '#registration-form';

$(REGISTRATION_FORM).on('submit', event => {
  event.preventDefault();
  const formData = $(REGISTRATION_FORM).serialize();
  $.ajax('/teams', {
    data: formData,
    type: 'POST',
    success: () => {
      alert('Successfully registered');
      $(REGISTRATION_FORM).trigger('reset');
    },
    error: () => {
      alert('Registration failed');
    },
  });
});
