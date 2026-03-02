let messageState = {
    currentPage: 1,
    rowsPerPage: 6,
    search: "",
};

export function renderMessages() {
    const section = document.getElementById("adminMessages");
    section.classList.remove("hidden");

    section.innerHTML = `
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <h3 class="fw-bold">Customer Messages</h3>
            <div class="d-flex gap-2 w-100 w-md-auto">
                <input type="text" id="messageSearch" class="form-control" placeholder="Search by name, email, or subject...">
            </div>
        </div>
        <div id="messagesContainer" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3"></div>
        <div id="messagesPagination" class="d-flex justify-content-end mt-3"></div>

        <!-- View Message Modal -->
        <div class="modal fade" id="viewMessageModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-4 shadow-lg border-0">
                    <div class="modal-header bg-gradient-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-envelope-open me-2"></i>Message Details
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="mb-3">
                            <div class="info-row mb-2">
                                <i class="bi bi-person me-2 text-primary"></i>
                                <strong>Name:</strong> <span id="msgModalName"></span>
                            </div>
                            <div class="info-row mb-2">
                                <i class="bi bi-envelope me-2 text-success"></i>
                                <strong>Email:</strong> <span id="msgModalEmail"></span>
                            </div>
                            <div class="info-row mb-2">
                                <i class="bi bi-tag me-2 text-warning"></i>
                                <strong>Subject:</strong> <span id="msgModalSubject"></span>
                            </div>
                            <div class="info-row mb-2">
                                <i class="bi bi-calendar me-2 text-secondary"></i>
                                <strong>Date:</strong> <span id="msgModalDate"></span>
                            </div>
                        </div>
                        <hr>
                        <div>
                            <h6 class="text-primary"><i class="bi bi-chat-left-text me-1"></i>Message</h6>
                            <div id="msgModalMessage" class="p-3 rounded" style="background: #f1f5f9; max-height: 100px; overflow-y: auto; overflow-x: hidden; word-break: break-word;"></div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-end border-0">
                        <button type="button" class="btn btn-secondary btn-sm px-4" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    attachMessageEvents();
    renderMessageCards();
}

function renderMessageCards() {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    const search = messageState.search;

    let filtered = messages.filter(msg => {
        return (
            msg.name.toLowerCase().includes(search) ||
            msg.email.toLowerCase().includes(search) ||
            msg.subject.toLowerCase().includes(search)
        );
    });

    const container = document.getElementById("messagesContainer");

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 text-muted">
                <i class="bi bi-envelope-open fs-1"></i>
                <h5>No Messages Found</h5>
                <p>No customer messages to display</p>
            </div>
        `;
        document.getElementById("messagesPagination").innerHTML = "";
        return;
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const totalPages = Math.ceil(filtered.length / messageState.rowsPerPage);
    const start = (messageState.currentPage - 1) * messageState.rowsPerPage;
    const paginated = filtered.slice(start, start + messageState.rowsPerPage);

    container.innerHTML = paginated
        .map(
            (msg) => `
        <div class="col">
            <div class="user-card h-100">
                <div class="user-header">
                    <h6 class="mb-0 text-truncate fw-bold" style="max-width: 180px; color: #1e293b;">
                        <i class="bi bi-person-circle me-1"></i>${msg.name}
                    </h6>
                    <span class="role-badge status-pending">${msg.subject}</span>
                </div>
                <div class="small text-muted text-truncate mt-1">
                    <i class="bi bi-envelope me-1"></i>${msg.email}
                </div>
                <div class="small text-muted mt-1">
                    <i class="bi bi-calendar me-1"></i>${msg.date}
                </div>
                <div class="mt-3 p-2 rounded" style="background: #f1f5f9; max-height: 100px; overflow-y: auto; overflow-x: hidden; word-break: break-word;">
                    <small>${msg.message}</small>
                </div>
                <div class="d-flex justify-content-end mt-auto pt-3 border-top border-light">
                    <button class="btn btn-sm btn-soft btn-soft-primary view-message" data-id="${msg.id}">
                        <i class="bi bi-eye me-1"></i> View
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join("");

    renderMessagePagination(totalPages);
    attachViewMessageEvents(filtered);
}

function renderMessagePagination(totalPages) {
    const container = document.getElementById("messagesPagination");
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `
            <button class="page-btn ${i === messageState.currentPage ? "active-page" : ""}" 
                data-page="${i}">
                ${i}
            </button>
        `;
    }

    document.querySelectorAll("#messagesPagination .page-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            messageState.currentPage = parseInt(btn.dataset.page);
            renderMessageCards();
        });
    });
}

function attachMessageEvents() {
    document.getElementById("messageSearch").addEventListener("input", (e) => {
        messageState.search = e.target.value.toLowerCase().trim();
        messageState.currentPage = 1;
        renderMessageCards();
    });
}

function attachViewMessageEvents(messages) {
    document.querySelectorAll(".view-message").forEach(btn => {
        btn.addEventListener("click", () => {
            const msg = messages.find(m => m.id === btn.dataset.id);
            if (!msg) return;

            document.getElementById("msgModalName").textContent = msg.name;
            document.getElementById("msgModalEmail").textContent = msg.email;
            document.getElementById("msgModalSubject").textContent = msg.subject;
            document.getElementById("msgModalDate").textContent = msg.date;
            document.getElementById("msgModalMessage").textContent = msg.message;

            const modal = new bootstrap.Modal(document.getElementById("viewMessageModal"));
            modal.show();
        });
    });
}