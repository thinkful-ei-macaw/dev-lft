import React from 'react';

const VacancyModal = ({
  handleSubmitVacancy = () => {},
  handleCloseVacancyModal = () => {}
}) => {
  return (
    <form onSubmit={handleSubmitVacancy} name="add-vacancy-form">
      <label htmlFor="vacancy-title">Role:</label>
      <input name="vacancy-title" id="vacancy-title" />
      <label htmlFor="vacancy-description">Description:</label>
      <input name="vacancy-description" id="vacancy-description" />
      <label htmlFor="vacancy-skills">Skills:</label>
      <p>Add a comma after each skill. example: React, CSS</p>
      <input name="vacancy-skills" id="vacancy-skills" />
      <button type="submit">Submit</button>
      <button onClick={handleCloseVacancyModal} type="button">
        Cancel
      </button>
    </form>
  );
};

export default VacancyModal;
