const handleDelete = async (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=csrfToken]").value;
  const article = btn.closest("article");

  fetch(`/admin/delete-product/${productId}`, {
    method: "DELETE",
    headers: { csrfToken },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.status === 200) {
        article.remove();
      }
    })
    .catch((error) => {
      throw error;
    });
};
