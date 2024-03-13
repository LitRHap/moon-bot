const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/.marv/i.test(m.quoted.text)) return !0
  this.whatmarvel = this.whatmarvel ? this.whatmarvel : {}
  if (!(id in this.whatmarvel)) return m.reply('The matter has ended.')
  if (m.quoted.id == this.whatmarvel[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.whatmarvel[id][1]))
    // m.reply(JSON.stringify(json, null, '\t'))
    if (m.text.toLowerCase() == json.data.title.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.whatmarvel[id][2]
      global.db.data.users[m.sender].tiketcoin += 1
      m.reply(`*Correct!*\n+${this.whatmarvel[id][2]} XP\n+1 Tiketcoin`)
      clearTimeout(this.whatmarvel[id][3])
      delete this.whatmarvel[id]
    } else if (similarity(m.text.toLowerCase(), json.data.title.toLowerCase().trim()) >= threshold) m.reply(`*Approaching!*`)
    else m.reply(`*Wrong!*`)
  }
  return !0
}
handler.exp = 0
module.exports = handler