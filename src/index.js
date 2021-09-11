// @ts-ignore
import remarkGemoji from 'remark-gemoji'

export default function gemoji() {
  return {
    remark: (u) => u.use(remarkGemoji),
  }
}
