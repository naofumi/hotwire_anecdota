export function csrfToken() {
  const param = document.querySelector('meta[name="csrf-param"]').content
  const token = document.querySelector('meta[name="csrf-token"]').content
  return {param, token}
}
