import React from 'react';
import Button from '../Button/Button';

const VacancyModal = ({
  onSubmitVacancy = () => { },
  onCloseVacancyModal = () => { },
  error = null
}) => {
  return (
    <form onSubmit={onSubmitVacancy} className="open-position" name="add-vacancy-form" autoComplete="off">
      {error
        ? <p role="alert" className="error">{error}</p>
        : ''}
      <div className="project">
        <div className="project-left">
          <div className="input-group">
            <div className="input">
              <label htmlFor="vacancy-title">Role *</label>
              <input autoFocus={true} name="vacancy-title" id="vacancy-title" minLength="2" maxLength="30" placeholder="New Role" required />
            </div>
          </div>
          <div className="input-group">
            <div className="input">
              <label htmlFor="vacancy-description">Description *</label>
              <textarea rows="4" name="vacancy-description" id="vacancy-description" minLength="10" maxLength="255" required placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."></textarea>
            </div>
          </div>
        </div>

        <div className="project-right">
          <div className="input-group">
            <div className="input">
              <label htmlFor="vacancy-skills">Skills *</label>
              <input name="vacancy-skills" id="vacancy-skills" minLength="3" maxLength="358" placeholder="JavaScript, HTML" required />
            </div>
          </div>
        </div>

      </div>

      <Button type="submit">Submit</Button>
      <Button className="clear" onClick={onCloseVacancyModal}>Cancel</Button>

    </form>
  );
};

export default VacancyModal;
