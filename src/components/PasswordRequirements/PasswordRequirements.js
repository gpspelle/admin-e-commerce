const hasAtLeastEigthChars = (password) => password.length >= 8
function hasLowercase(password) {
  return password.toUpperCase() != password
}
function hasUppercase(password) {
  return password.toLowerCase() != password
}
function hasDigit(password) {
  return /\d/.test(password)
}

export default function PasswordRequirements({ password }) {
  const conditions = {
    atLeastEigthChars: hasAtLeastEigthChars(password),
    lowercase: hasLowercase(password),
    uppercase: hasUppercase(password),
    digit: hasDigit(password),
  }

  return (
    <ol type="I">
      <li>
        Pelo menos 8 (oito) caracteres{" "}
        {conditions.atLeastEigthChars && <span>&#9989;</span>}
      </li>
      <li>
        Pelo menos uma letra minúscula {conditions.lowercase && <span>&#9989;</span>}
      </li>
      <li>
        Pelo menos uma letra maiúscula {conditions.uppercase && <span>&#9989;</span>}
      </li>
      <li>Pelo menos um dígito {conditions.digit && <span>&#9989;</span>}</li>
    </ol>
  )
}
