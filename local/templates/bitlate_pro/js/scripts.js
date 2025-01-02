function closeAgeModal(event)
{
    sessionStorage.setItem("mm_age-modal", "closed");
    document.querySelector(".age-modal__wrapper").classList.remove('showed');
}

document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem("mm_age-modal") && document.querySelector(".age-modal__wrapper"))
    {
        document.querySelector(".age-modal__wrapper").classList.add('showed');

        document.querySelector('button.age-modal__button[data-modal-accept]').addEventListener('click', closeAgeModal);
    }
})