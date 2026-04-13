let toastTimer = null
export function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast')

    const toastMsg = document.getElementById('toast-msg')
    const toastIcon = document.getElementById('toast-icon')

    toastMsg.textContent = msg
    toastIcon.textContent = type === 'success' ? '✓' : '✕'
    toast.className = `toast ${type} show`

    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.classList.remove('show')
    }, 3000)
}

export function showConfirm(msg) {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal-confirm');
        document.getElementById('confirm-msg').textContent = msg;
        modal.showModal();

        document.getElementById('confirm-sim').onclick = () => {
            modal.close();
            resolve(true);
        };

        document.getElementById('confirm-nao').onclick = () => {
            modal.close();
            resolve(false);
        };
    });
}