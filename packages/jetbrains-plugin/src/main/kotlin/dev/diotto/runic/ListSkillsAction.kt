package dev.diotto.runic

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.ui.DialogWrapper
import javax.swing.JComponent
import javax.swing.JLabel
import javax.swing.JPanel
import java.awt.BorderLayout

class ListSkillsAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        SkillsDialog(e.project).show()
    }
}

class SkillsDialog(project: com.intellij.openapi.project.Project?) : DialogWrapper(project) {
    init {
        title = "Runic Skills — 91 AI & Dev Skills"
        init()
    }

    override fun createCenterPanel(): JComponent {
        val text = """
            <html><body style="font-family:sans-serif;padding:8px;width:400px">
            <h3 style="margin-top:0">91 skills across 6 domains</h3>
            <p>Ask your AI assistant to use any skill by name or trigger:</p>
            <ul>
              <li><b>code-review</b> — "review this", "audit this file"</li>
              <li><b>debug-error</b> — "why is this failing?"</li>
              <li><b>generate-tests</b> — "write tests for this"</li>
              <li><b>refactor</b> — "clean this up"</li>
              <li><b>explain-code</b> — "what does this do?"</li>
              <li><b>git-commit</b> — "write a commit message"</li>
              <li><b>llm-cost-optimizer</b> — "reduce my LLM costs"</li>
              <li><b>prompt-engineering</b> — "improve this prompt"</li>
              <li><b>agent-designer</b> — "design an agent"</li>
              <li>...and 82 more</li>
            </ul>
            <p><a href="https://github.com/Diottodev/runic">github.com/Diottodev/runic</a></p>
            </body></html>
        """.trimIndent()
        val panel = JPanel(BorderLayout())
        panel.add(JLabel(text), BorderLayout.CENTER)
        return panel
    }
}
