import Swal from "sweetalert2";

export async function deleted(name) {
    Swal.fire({
        title: 'Deleted!',
        text: `${name} has been deleted.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#f1f5f9"
    }); 
}

export async function confirmDelete(name, title = "Delete this record?", text = "This action cannot be undone.") {
    const result = await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        background: "#0f172a",
        color: "#f1f5f9"
    });

    if (!result.isConfirmed) return false;
    return true;
}

export async function noPermission(title = 'Action denied.', text = 'You do not have permission to delete. Please contact your administrator.') {
   Swal.fire({
    title,
    text,
    icon: 'error'
});
}

export async function addNewNotif(name = '', success = true, errorMsg = '') {
    if (!success) {
        Swal.fire({
            title: 'Failed to add client',
            text: errorMsg || 'Something went wrong.',
            icon: 'error',
            background: "#0f172a",
            color: "#f1f5f9"
        });
        return;
    }
    Swal.fire({
        title: 'Client added',
        text: `${name} has been added.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#f1f5f9"
    });
}

export async function updateNotif(name = '', success = true, errorMsg = '') {
    if (!success) {
        Swal.fire({
            title: 'Failed to update client',
            text: errorMsg || 'Something went wrong.',
            icon: 'error',
            background: "#0f172a",
            color: "#f1f5f9"
        });
        return;
    }
    Swal.fire({
        title: 'Client updated',
        text: `${name} has been updated.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#f1f5f9"
    });
}