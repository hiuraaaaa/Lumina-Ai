// components/ui/Markdown.tsx — parser markdown ringan buat balasan AI.
// Support: heading (#/##/###), **bold**, *italic*, `inline code`, ```code block```, bullet (-/*), ---.
// Sengaja gak pake library eksternal biar gak nambah dependency.
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/lib/theme/theme';

type InlineToken = { text: string; bold?: boolean; italic?: boolean; code?: boolean };

function parseInline(line: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index) });
    }
    const chunk = match[0];
    if (chunk.startsWith('**')) {
      tokens.push({ text: chunk.slice(2, -2), bold: true });
    } else if (chunk.startsWith('`')) {
      tokens.push({ text: chunk.slice(1, -1), code: true });
    } else {
      tokens.push({ text: chunk.slice(1, -1), italic: true });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) tokens.push({ text: line.slice(lastIndex) });
  return tokens;
}

export function Markdown({ content, color }: { content: string; color?: string }) {
  const theme = useTheme();
  const textColor = color ?? theme.text;

  // Pisahin code-fence (```) dulu — index ganjil = blok kode.
  const parts = content.split(/```/);

  return (
    <View>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const lines = part.split('\n');
          const firstLineIsLang = lines[0].trim().length > 0 && !lines[0].includes(' ');
          const code = (firstLineIsLang ? lines.slice(1) : lines).join('\n').replace(/\n$/, '');
          return (
            <View key={i} style={{
              backgroundColor: theme.card,
              borderRadius: 12,
              padding: 12,
              marginVertical: 8,
            }}>
              <Text style={{
                color: textColor, fontFamily: 'JetBrainsMono_500Medium',
                fontSize: 12.5, lineHeight: 19,
              }}>
                {code}
              </Text>
            </View>
          );
        }

        const lines = part.split('\n');
        return (
          <View key={i}>
            {lines.map((rawLine, j) => {
              const trimmed = rawLine.trim();
              if (!trimmed) return <View key={j} style={{ height: 8 }} />;
              if (trimmed === '---') return <View key={j} style={{ height: 14 }} />;

              let headingLevel = 0;
              let text = trimmed;
              const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
              if (headingMatch) {
                headingLevel = headingMatch[1].length;
                text = headingMatch[2];
              }

              const bulletMatch = text.match(/^[-*]\s+(.*)/);
              const isBullet = !!bulletMatch;
              if (bulletMatch) text = bulletMatch[1];

              const tokens = parseInline(text);
              const baseSize = headingLevel === 1 ? 18 : headingLevel === 2 ? 16.5 : headingLevel === 3 ? 15 : 14;
              const baseWeight = headingLevel > 0 ? '800' : '400';

              return (
                <View key={j} style={{ flexDirection: 'row', marginBottom: headingLevel > 0 ? 6 : 4 }}>
                  {isBullet && (
                    <Text style={{ color: textColor, fontSize: baseSize, marginRight: 6 }}>•</Text>
                  )}
                  <Text style={{ flex: 1, color: textColor, fontSize: baseSize, fontWeight: baseWeight as any, lineHeight: baseSize + 8 }}>
                    {tokens.map((t, k) => (
                      <Text
                        key={k}
                        style={{
                          fontWeight: t.bold ? '800' : (baseWeight as any),
                          fontStyle: t.italic ? 'italic' : 'normal',
                          fontFamily: t.code ? 'JetBrainsMono_500Medium' : undefined,
                          backgroundColor: t.code ? `${theme.accent}18` : undefined,
                        }}
                      >
                        {t.text}
                      </Text>
                    ))}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

