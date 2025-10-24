/**
 * AnsiUp 类型定义和导出
 * 包装 ansi_up.min.js 以便在 TypeScript 中使用
 */

// 简单的 ANSI 转 HTML 实现（使用 AnsiUp 的逻辑）
export class AnsiUp {
  private fg: any = null
  private bg: any = null
  private bold = false
  private italic = false
  private underline = false

  private ansi_colors = [
    [
      { rgb: [0, 0, 0], class_name: 'ansi-black' },
      { rgb: [187, 0, 0], class_name: 'ansi-red' },
      { rgb: [0, 187, 0], class_name: 'ansi-green' },
      { rgb: [187, 187, 0], class_name: 'ansi-yellow' },
      { rgb: [0, 0, 187], class_name: 'ansi-blue' },
      { rgb: [187, 0, 187], class_name: 'ansi-magenta' },
      { rgb: [0, 187, 187], class_name: 'ansi-cyan' },
      { rgb: [255, 255, 255], class_name: 'ansi-white' },
    ],
    [
      { rgb: [85, 85, 85], class_name: 'ansi-bright-black' },
      { rgb: [255, 85, 85], class_name: 'ansi-bright-red' },
      { rgb: [0, 255, 0], class_name: 'ansi-bright-green' },
      { rgb: [255, 255, 85], class_name: 'ansi-bright-yellow' },
      { rgb: [85, 85, 255], class_name: 'ansi-bright-blue' },
      { rgb: [255, 85, 255], class_name: 'ansi-bright-magenta' },
      { rgb: [85, 255, 255], class_name: 'ansi-bright-cyan' },
      { rgb: [255, 255, 255], class_name: 'ansi-bright-white' },
    ],
  ]

  constructor() {}

  private escape_txt_for_html(text: string): string {
    return text.replace(/[&<>"']/gm, (match) => {
      if (match === '&') return '&amp;'
      if (match === '<') return '&lt;'
      if (match === '>') return '&gt;'
      if (match === '"') return '&quot;'
      if (match === "'") return '&#x27;'
      return match
    })
  }

  private process_ansi(codes: string): void {
    const parts = codes.split(';')
    for (let i = 0; i < parts.length; i++) {
      const code = parseInt(parts[i], 10)
      if (isNaN(code) || code === 0) {
        this.fg = this.bg = null
        this.bold = false
        this.italic = false
        this.underline = false
      } else if (code === 1) {
        this.bold = true
      } else if (code === 3) {
        this.italic = true
      } else if (code === 4) {
        this.underline = true
      } else if (code === 22) {
        this.bold = false
      } else if (code === 23) {
        this.italic = false
      } else if (code === 24) {
        this.underline = false
      } else if (code === 39) {
        this.fg = null
      } else if (code === 49) {
        this.bg = null
      } else if (code >= 30 && code < 38) {
        this.fg = this.ansi_colors[0][code - 30]
      } else if (code >= 40 && code < 48) {
        this.bg = this.ansi_colors[0][code - 40]
      } else if (code >= 90 && code < 98) {
        this.fg = this.ansi_colors[1][code - 90]
      } else if (code >= 100 && code < 108) {
        this.bg = this.ansi_colors[1][code - 100]
      }
    }
  }

  ansi_to_html(text: string): string {
    let result = ''
    let buffer = ''
    let inEscape = false
    let escapeBuffer = ''

    for (let i = 0; i < text.length; i++) {
      const char = text[i]

      if (char === '\x1b' && text[i + 1] === '[') {
        // 找到 ANSI 转义序列开始
        if (buffer) {
          result += this.transform_to_html(buffer)
          buffer = ''
        }
        inEscape = true
        escapeBuffer = ''
        i++ // 跳过 '['
        continue
      }

      if (inEscape) {
        if (char === 'm') {
          // ANSI 序列结束
          this.process_ansi(escapeBuffer)
          inEscape = false
          escapeBuffer = ''
        } else {
          escapeBuffer += char
        }
      } else {
        buffer += char
      }
    }

    if (buffer) {
      result += this.transform_to_html(buffer)
    }

    return result
  }

  private transform_to_html(text: string): string {
    if (text.length === 0) return text

    text = this.escape_txt_for_html(text)

    if (!this.bold && !this.italic && !this.underline && this.fg === null && this.bg === null) {
      return text
    }

    const styles: string[] = []
    if (this.bold) styles.push('font-weight:bold')
    if (this.italic) styles.push('font-style:italic')
    if (this.underline) styles.push('text-decoration:underline')
    if (this.fg) styles.push(`color:rgb(${this.fg.rgb.join(',')})`)
    if (this.bg) styles.push(`background-color:rgb(${this.bg.rgb.join(',')})`)

    if (styles.length === 0) return text

    return `<span style="${styles.join(';')}">${text}</span>`
  }
}

export default AnsiUp

