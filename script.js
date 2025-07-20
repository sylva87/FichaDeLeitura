class BookReaderApp {
  constructor() {
    this.bookData = {
      title: "",
      author: "",
      startDate: "",
      endDate: "",
      rating: 0,
      pages: "",
      genre: "",
      publisher: "",
      bookType: "fisico",
      characters: "",
      quotes: "",
      coverImage: "",
      writingQuality: 5,
      plotDevelopment: 5,
      charactersRating: 5,
      easeOfReading: 5,
      recommend: "",
      feelings: [],
    }

    this.currentEditingId = null
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.loadSavedData()
    this.updatePreview()
    this.loadSavedBooks()
  }

  setupEventListeners() {
    // Inputs básicos
    document.getElementById("title").addEventListener("input", (e) => {
      this.bookData.title = e.target.value
      this.updatePreview()
    })

    document.getElementById("author").addEventListener("input", (e) => {
      this.bookData.author = e.target.value
      this.updatePreview()
    })

    document.getElementById("startDate").addEventListener("change", (e) => {
      this.bookData.startDate = e.target.value
      this.updatePreview()
    })

    document.getElementById("endDate").addEventListener("change", (e) => {
      this.bookData.endDate = e.target.value
      this.updatePreview()
    })

    document.getElementById("pages").addEventListener("input", (e) => {
      this.bookData.pages = e.target.value
      this.updatePreview()
    })

    document.getElementById("genre").addEventListener("input", (e) => {
      this.bookData.genre = e.target.value
      this.updatePreview()
    })

    document.getElementById("publisher").addEventListener("input", (e) => {
      this.bookData.publisher = e.target.value
      this.updatePreview()
    })

    document.getElementById("characters").addEventListener("input", (e) => {
      this.bookData.characters = e.target.value
      this.updatePreview()
    })

    document.getElementById("quotes").addEventListener("input", (e) => {
      this.bookData.quotes = e.target.value
      this.updatePreview()
    })

    // Radio buttons para tipo de livro
    document.querySelectorAll('input[name="bookType"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.bookData.bookType = e.target.value
        this.updatePreview()
      })
    })

    // Radio buttons para recomendação
    document.querySelectorAll('input[name="recommend"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.bookData.recommend = e.target.value
        this.updatePreview()
      })
    })

    // Checkboxes para sentimentos
    document
      .querySelectorAll('.feelings-grid input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
          if (e.target.checked) {
            this.bookData.feelings.push(e.target.value)
          } else {
            this.bookData.feelings = this.bookData.feelings.filter((feeling) => feeling !== e.target.value)
          }
          this.updatePreview()
        })
      })

    // Sliders para avaliações detalhadas
    ;["writingQuality", "plotDevelopment", "charactersRating", "easeOfReading"].forEach((rating) => {
      const slider = document.getElementById(rating)
      const valueSpan = slider.nextElementSibling

      slider.addEventListener("input", (e) => {
        const value = e.target.value
        this.bookData[rating] = Number.parseInt(value)
        valueSpan.textContent = value
        this.updatePreview()
      })
    })

    // Star rating
    document.querySelectorAll("#starRating i").forEach((star) => {
      star.addEventListener("click", (e) => {
        const rating = Number.parseInt(e.target.dataset.rating)
        this.bookData.rating = rating
        this.updateStarRating()
        this.updatePreview()
      })

      star.addEventListener("mouseenter", (e) => {
        const rating = Number.parseInt(e.target.dataset.rating)
        this.highlightStars(rating)
      })
    })

    document.getElementById("starRating").addEventListener("mouseleave", () => {
      this.updateStarRating()
    })

    // Upload de imagem
    document.getElementById("coverImage").addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.bookData.coverImage = e.target.result
          this.updatePreview()
        }
        reader.readAsDataURL(file)
      }
    })

    // Botões
    document.getElementById("saveBtn").addEventListener("click", () => {
      this.saveBook()
    })

    document.getElementById("downloadBtn").addEventListener("click", () => {
      this.downloadPDF()
    })

    document.getElementById("showSavedBooksBtn").addEventListener("click", () => {
      this.showSavedBooksPanel()
    })

    // Painel lateral
    document.getElementById("closePanelBtn").addEventListener("click", () => {
      this.closeSavedBooksPanel()
    })

    // Overlay - CORRIGIDO
    document.getElementById("overlay").addEventListener("click", () => {
      this.closeSavedBooksPanel()
      closeRenameModal()
    })
  }

  highlightStars(rating) {
    document.querySelectorAll("#starRating i").forEach((star, index) => {
      if (index < rating) {
        star.classList.add("active")
      } else {
        star.classList.remove("active")
      }
    })
  }

  updateStarRating() {
    this.highlightStars(this.bookData.rating)
  }

  updatePreview() {
    const preview = document.getElementById("fichaPreview")

    preview.innerHTML = `
            <!-- Decorações florais -->
            <div class="floral-decoration floral-top-left">❋</div>
            <div class="floral-decoration floral-top-right">❋</div>
            <div class="floral-decoration floral-bottom-left">❋</div>
            <div class="floral-decoration floral-bottom-right">❋</div>

            <!-- Header -->
            <div class="pdf-header">
                <div class="pdf-title">RESENHA</div>
                <div class="pdf-subtitle">DE LIVRO</div>
            </div>

            <!-- Conteúdo principal -->
            <div class="pdf-main-content">
                <!-- Seção da capa -->
                <div class="pdf-cover-section">
                    <div class="pdf-cover-frame">
                        ${
                          this.bookData.coverImage
                            ? `<img src="${this.bookData.coverImage}" alt="Capa do livro" class="pdf-cover-image">`
                            : '<div class="pdf-cover-placeholder">Capa</div>'
                        }
                    </div>

                    <!-- Avaliação por estrelas -->
                    <div class="pdf-rating">
                        ${[1, 2, 3, 4, 5]
                          .map((i) => `<span class="pdf-star ${i <= this.bookData.rating ? "active" : ""}">★</span>`)
                          .join("")}
                    </div>

                    <!-- Tipos de livro -->
                    <div class="pdf-book-types">
                        <div class="pdf-book-type">
                            <div class="pdf-book-type-icon ${this.bookData.bookType === "fisico" ? "active" : ""}">📖</div>
                            <div class="pdf-book-type-label">Físico</div>
                        </div>
                        <div class="pdf-book-type">
                            <div class="pdf-book-type-icon ${this.bookData.bookType === "ebook" ? "active" : ""}">📱</div>
                            <div class="pdf-book-type-label">E-book</div>
                        </div>
                        <div class="pdf-book-type">
                            <div class="pdf-book-type-icon ${this.bookData.bookType === "audiobook" ? "active" : ""}">🎧</div>
                            <div class="pdf-book-type-label">Audio</div>
                        </div>
                    </div>
                </div>

                <!-- Seção de informações -->
                <div class="pdf-info-section">
                    <!-- Título -->
                    <div class="pdf-info-field">
                        <span class="pdf-field-label">Título</span>
                        <div class="pdf-field-content">${this.bookData.title || ""}</div>
                    </div>

                    <!-- Autor -->
                    <div class="pdf-info-field">
                        <span class="pdf-field-label">Autor/a</span>
                        <div class="pdf-field-content">${this.bookData.author || ""}</div>
                    </div>

                    <!-- Gênero e Páginas -->
                    <div class="pdf-double-field">
                        <div class="pdf-info-field">
                            <span class="pdf-field-label">Gênero</span>
                            <div class="pdf-field-content">${this.bookData.genre || ""}</div>
                        </div>
                        <div class="pdf-info-field">
                            <span class="pdf-field-label">Páginas</span>
                            <div class="pdf-field-content">${this.bookData.pages || ""}</div>
                        </div>
                    </div>

                    <!-- Datas -->
                    <div class="pdf-double-field">
                        <div class="pdf-info-field">
                            <span class="pdf-field-label">Início</span>
                            <div class="pdf-field-content">${this.formatDate(this.bookData.startDate)}</div>
                        </div>
                        <div class="pdf-info-field">
                            <span class="pdf-field-label">Fim</span>
                            <div class="pdf-field-content">${this.formatDate(this.bookData.endDate)}</div>
                        </div>
                    </div>

                    <!-- Avaliações detalhadas -->
                    <div class="pdf-detailed-ratings">
                        <span class="pdf-field-label" style="display: block; text-align: center; margin-bottom: 8px;">Avaliações Detalhadas</span>
                        <div class="pdf-rating-row">
                            <span class="pdf-rating-label">Escrita:</span>
                            <div class="pdf-rating-dots">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                                  .map(
                                    (i) =>
                                      `<div class="pdf-rating-dot ${i <= this.bookData.writingQuality ? "active" : ""}"></div>`,
                                  )
                                  .join("")}
                            </div>
                        </div>
                        <div class="pdf-rating-row">
                            <span class="pdf-rating-label">Enredo:</span>
                            <div class="pdf-rating-dots">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                                  .map(
                                    (i) =>
                                      `<div class="pdf-rating-dot ${i <= this.bookData.plotDevelopment ? "active" : ""}"></div>`,
                                  )
                                  .join("")}
                            </div>
                        </div>
                        <div class="pdf-rating-row">
                            <span class="pdf-rating-label">Personagens:</span>
                            <div class="pdf-rating-dots">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                                  .map(
                                    (i) =>
                                      `<div class="pdf-rating-dot ${i <= this.bookData.charactersRating ? "active" : ""}"></div>`,
                                  )
                                  .join("")}
                            </div>
                        </div>
                        <div class="pdf-rating-row">
                            <span class="pdf-rating-label">Leitura:</span>
                            <div class="pdf-rating-dots">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                                  .map(
                                    (i) =>
                                      `<div class="pdf-rating-dot ${i <= this.bookData.easeOfReading ? "active" : ""}"></div>`,
                                  )
                                  .join("")}
                            </div>
                        </div>
                    </div>

                    <!-- Recomendação -->
                    <div class="pdf-info-field">
                        <span class="pdf-field-label" style="text-align: center; display: block; margin-bottom: 8px;">Recomendaria?</span>
                        <div class="pdf-recommend">
                            <div class="pdf-recommend-option">
                                <div class="pdf-recommend-radio ${this.bookData.recommend === "yes" ? "active" : ""}"></div>
                                <span>Sim</span>
                            </div>
                            <div class="pdf-recommend-option">
                                <div class="pdf-recommend-radio ${this.bookData.recommend === "no" ? "active" : ""}"></div>
                                <span>Não</span>
                            </div>
                        </div>
                    </div>

                    <!-- Sentimentos -->
                    <div class="pdf-info-field">
                        <span class="pdf-field-label">Meus Sentimentos</span>
                        <div class="pdf-feelings">
                            ${this.getFeelingsList()}
                        </div>
                    </div>

                    <!-- Pensamentos -->
                    <div class="pdf-thoughts-section">
                        <div class="pdf-thoughts-title">Meus Pensamentos</div>
                        <div class="pdf-thoughts-content">
                            <strong>Personagens:</strong><br>
                            ${this.bookData.characters || ""}<br><br>
                            <strong>Frases Marcantes:</strong><br>
                            ${this.bookData.quotes || ""}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="pdf-footer">Design: @sylva.jpp</div>
        `
  }

  getFeelingsList() {
    const allFeelings = [
      "Melhor livro que já li",
      "Não gostei nada",
      "Já li melhores",
      "Me fez chorar",
      "Leitura obrigatória",
      "Não consegui terminar",
    ]

    return allFeelings
      .map((feeling) => {
        const isSelected = this.bookData.feelings.includes(feeling)
        return `
                <div class="pdf-feeling-item">
                    <div class="pdf-feeling-check ${isSelected ? "active" : ""}"></div>
                    <span>${feeling}</span>
                </div>
            `
      })
      .join("")
  }

  formatDate(dateString) {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  saveBook() {
    try {
      const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]")
      const bookToSave = {
        ...this.bookData,
        id: this.currentEditingId || Date.now(),
        customName: this.bookData.title || `Livro ${savedBooks.length + 1}`,
        savedAt: new Date().toISOString(),
      }

      if (this.currentEditingId) {
        const index = savedBooks.findIndex((book) => book.id === this.currentEditingId)
        if (index !== -1) {
          savedBooks[index] = bookToSave
        }
      } else {
        savedBooks.push(bookToSave)
      }

      localStorage.setItem("savedBooks", JSON.stringify(savedBooks))
      this.showSavedBooksPanel()
      this.loadSavedBooks()

      this.showNotification("Ficha salva com sucesso!")
    } catch (error) {
      this.showNotification("Erro ao salvar a ficha. Tente novamente.", "error")
    }
  }

  loadSavedBooks() {
    try {
      const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]")
      const container = document.getElementById("savedBooksList")

      if (savedBooks.length === 0) {
        container.innerHTML = '<p class="no-books">Nenhuma ficha salva ainda.</p>'
        return
      }

      container.innerHTML = savedBooks
        .map(
          (book) => `
                <div class="saved-book-item" data-id="${book.id}">
                    <div class="book-item-header">
                        <span class="book-title">${book.customName}</span>
                        <div class="book-actions">
                            <button class="action-btn" onclick="window.app.loadBook(${book.id})" title="Carregar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn" onclick="window.app.renameBook(${book.id})" title="Renomear">
                                <i class="fas fa-tag"></i>
                            </button>
                            <button class="action-btn" onclick="window.app.deleteBook(${book.id})" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="book-info">
                        <div><strong>Autor:</strong> ${book.author || "Não informado"}</div>
                        <div><strong>Gênero:</strong> ${book.genre || "Não informado"}</div>
                        <div><strong>Salvo em:</strong> ${new Date(book.savedAt).toLocaleDateString("pt-BR")}</div>
                    </div>
                </div>
            `,
        )
        .join("")
    } catch (error) {
      console.error("Erro ao carregar livros salvos:", error)
    }
  }

  showSavedBooksPanel() {
    document.getElementById("savedBooksPanel").classList.add("open")
    document.getElementById("overlay").classList.add("show")
  }

  closeSavedBooksPanel() {
    document.getElementById("savedBooksPanel").classList.remove("open")
    document.getElementById("overlay").classList.remove("show")
  }

  loadBook(id) {
    try {
      const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]")
      const book = savedBooks.find((b) => b.id === id)

      if (book) {
        this.bookData = { ...book }
        this.currentEditingId = id
        this.populateForm()
        this.updatePreview()
        this.closeSavedBooksPanel()
        this.showNotification("Ficha carregada com sucesso!")
      }
    } catch (error) {
      this.showNotification("Erro ao carregar a ficha.", "error")
    }
  }

  renameBook(id) {
    try {
      const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]")
      const book = savedBooks.find((b) => b.id === id)

      if (book) {
        document.getElementById("newBookName").value = book.customName
        document.getElementById("renameModal").classList.add("show")
        document.getElementById("overlay").classList.add("show")

        window.renamingBookId = id
      }
    } catch (error) {
      this.showNotification("Erro ao renomear a ficha.", "error")
    }
  }

  deleteBook(id) {
    if (confirm("Tem certeza que deseja excluir esta ficha?")) {
      try {
        const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]")
        const filteredBooks = savedBooks.filter((book) => book.id !== id)
        localStorage.setItem("savedBooks", JSON.stringify(filteredBooks))
        this.loadSavedBooks()
        this.showNotification("Ficha excluída com sucesso!")
      } catch (error) {
        this.showNotification("Erro ao excluir a ficha.", "error")
      }
    }
  }

  populateForm() {
    document.getElementById("title").value = this.bookData.title || ""
    document.getElementById("author").value = this.bookData.author || ""
    document.getElementById("startDate").value = this.bookData.startDate || ""
    document.getElementById("endDate").value = this.bookData.endDate || ""
    document.getElementById("pages").value = this.bookData.pages || ""
    document.getElementById("genre").value = this.bookData.genre || ""
    document.getElementById("publisher").value = this.bookData.publisher || ""
    document.getElementById("characters").value = this.bookData.characters || ""
    document.getElementById("quotes").value = this.bookData.quotes || ""

    // Tipo de livro
    const bookTypeRadio = document.querySelector(`input[name="bookType"][value="${this.bookData.bookType}"]`)
    if (bookTypeRadio) bookTypeRadio.checked = true

    // Recomendação
    if (this.bookData.recommend) {
      const recommendRadio = document.querySelector(`input[name="recommend"][value="${this.bookData.recommend}"]`)
      if (recommendRadio) recommendRadio.checked = true
    }

    // Sentimentos
    document
      .querySelectorAll('.feelings-grid input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = this.bookData.feelings.includes(checkbox.value)
      })

    // Sliders
    ;["writingQuality", "plotDevelopment", "charactersRating", "easeOfReading"].forEach((rating) => {
      const slider = document.getElementById(rating)
      const valueSpan = slider.nextElementSibling
      const value = this.bookData[rating] || 5
      slider.value = value
      valueSpan.textContent = value
    })

    this.updateStarRating()
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "15px 20px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "500",
      zIndex: "3000",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      backgroundColor: type === "error" ? "#ef4444" : "#10b981",
    })

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  async downloadPDF() {
    try {
      const element = document.getElementById("fichaPreview")

      // Temporariamente ajustar o elemento para captura
      const originalTransform = element.style.transform
      element.style.transform = "scale(1)"
      element.style.width = "210mm"
      element.style.height = "297mm"

      const html2canvas = window.html2canvas // Declare the variable here
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#e8d5c4",
        width: 794, // 210mm em pixels
        height: 1123, // 297mm em pixels
      })

      // Restaurar estilo original
      element.style.transform = originalTransform
      element.style.width = ""
      element.style.height = ""

      const imgData = canvas.toDataURL("image/png")
      const { jsPDF } = window.jspdf
      const pdf = new jsPDF("p", "mm", "a4")

      // Adicionar a imagem ocupando toda a página A4
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297)

      const fileName = this.bookData.title
        ? `resenha-${this.bookData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
        : "resenha-livro.pdf"

      pdf.save(fileName)
      this.showNotification("PDF gerado com sucesso!")
    } catch (error) {
      this.showNotification("Erro ao gerar PDF. Tente novamente.", "error")
      console.error("Erro:", error)
    }
  }

  loadSavedData() {
    try {
      const savedData = localStorage.getItem("currentBook")
      if (savedData) {
        this.bookData = JSON.parse(savedData)
        this.populateForm()
      }
    } catch (error) {
      console.log("Nenhum dado salvo encontrado")
    }
  }
}

// Funções globais para os botões
function closeRenameModal() {
  document.getElementById("renameModal").classList.remove("show")
  document.getElementById("overlay").classList.remove("show")
}

function confirmRename() {
  const newName = document.getElementById("newBookName").value.trim()
  const bookId = window.renamingBookId

  if (!newName) {
    alert("Por favor, digite um nome válido.")
    return
  }

  try {
    const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]")
    const bookIndex = savedBooks.findIndex((book) => book.id === bookId)

    if (bookIndex !== -1) {
      savedBooks[bookIndex].customName = newName
      localStorage.setItem("savedBooks", JSON.stringify(savedBooks))
      window.app.loadSavedBooks()
      window.app.showNotification("Ficha renomeada com sucesso!")
    }
  } catch (error) {
    window.app.showNotification("Erro ao renomear a ficha.", "error")
  }

  closeRenameModal()
}

// Inicializar a aplicação
document.addEventListener("DOMContentLoaded", () => {
  window.app = new BookReaderApp()
})

// Salvar dados automaticamente
window.addEventListener("beforeunload", () => {
  if (window.app) {
    localStorage.setItem("currentBook", JSON.stringify(window.app.bookData))
  }
})
