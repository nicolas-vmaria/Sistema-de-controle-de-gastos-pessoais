let toastTimer = null
export function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast')
    const toastMsg = document.getElementById('toast-msg')
    const toastIcon = document.getElementById('toast-icon')

    toastMsg.textContent = msg
    toastIcon.textContent = type === 'success' ? '✓' : '✕'

    // Se for um <dialog>, garante que ele esteja no top layer acima de qualquer modal aberto
    if (typeof toast.showModal === 'function') {
        if (toast.open) toast.close()
        toast.showModal()
    }

    toast.classList.remove('show')
    void toast.offsetWidth
    toast.className = `toast ${type} show`

    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.classList.remove('show')
        if (typeof toast.close === 'function') toast.close()
    }, 3000)
}

export function showConfirm(msg) {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal-confirm');

        if (modal.open) modal.close();

        document.getElementById('confirm-msg').textContent = msg;

        const btnSim = document.getElementById('confirm-sim');
        const btnNao = document.getElementById('confirm-nao');

        function cleanup() {
            btnSim.removeEventListener('click', onSim);
            btnNao.removeEventListener('click', onNao);
            modal.removeEventListener('cancel', onCancel);
        }

        function onSim() { cleanup(); modal.close(); resolve(true); }
        function onNao() { cleanup(); modal.close(); resolve(false); }
        function onCancel(e) { e.preventDefault(); cleanup(); resolve(false); }

        btnSim.addEventListener('click', onSim);
        btnNao.addEventListener('click', onNao);
        modal.addEventListener('cancel', onCancel);

        modal.showModal();
    });
}