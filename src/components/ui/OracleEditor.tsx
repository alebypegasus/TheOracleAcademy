import React, { useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Highlight } from '@tiptap/extension-highlight';
import { Youtube } from '@tiptap/extension-youtube';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare,
  Undo2, Redo2, Link as LinkIcon, Image as ImageIcon,
  Eraser, PaintBucket, Type, Indent, Outdent, Youtube as YoutubeIcon,
  X, UploadCloud
} from 'lucide-react';

interface MenuBarProps {
  editor: Editor | null;
}

// Subcomponente Modal para UI fluida sem prompts de navegador
const EditorModal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(147,51,234,0.15)] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const MenuBar = ({ editor }: MenuBarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para modais
  const [modalState, setModalState] = useState<'link' | 'image' | 'youtube' | null>(null);
  
  // Estados para os forms dos modais
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  
  const [imageUrl, setImageUrl] = useState('');
  
  const [ytUrl, setYtUrl] = useState('');
  const [ytWidth, setYtWidth] = useState('640');
  const [ytHeight, setYtHeight] = useState('480');

  if (!editor) {
    return null;
  }

  // --- IMAGES ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const result = readerEvent.target?.result as string;
        editor.chain().focus().setImage({ src: result }).run();
        setModalState(null);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleImageSubmit = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setModalState(null);
      setImageUrl('');
    }
  };

  // --- LINKS ---
  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setLinkText('');
    setModalState('link');
  };

  const handleLinkSubmit = () => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const { empty } = editor.state.selection;
      if (empty && linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`).run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      }
    }
    setModalState(null);
  };

  // --- YOUTUBE ---
  const handleYoutubeSubmit = () => {
    if (ytUrl) {
      editor.commands.setYoutubeVideo({
        src: ytUrl,
        width: Math.max(320, parseInt(ytWidth || '640', 10)),
        height: Math.max(180, parseInt(ytHeight || '480', 10)),
      });
      setModalState(null);
      setYtUrl('');
    }
  };

  // Componente de botão com Tooltip Tailwind Integrado arrumado com super z-index e hover-z
  const ToolbarButton = ({ onClick, isActive, disabled, children, title }: any) => (
    <div className="relative group inline-block hover:z-[9999]">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105
          ${isActive ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)]' : 'text-gray-400 hover:bg-white/10 hover:text-white'}
          ${disabled ? 'opacity-30 cursor-not-allowed hover:scale-100 active:scale-100' : 'cursor-pointer'}
        `}
      >
        {children}
      </button>
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none 
        bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 backdrop-blur-xl text-white text-xs py-1.5 px-3 rounded-lg shadow-2xl border border-white/20 z-[99999]">
        {title}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-b border-r border-white/20 rotate-45"></div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col gap-2 p-3 border-b border-white/10 bg-black/20 rounded-t-xl sticky top-0 z-[50] backdrop-blur-md">
        
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

        {/* Linha Superior */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-2">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} title="Desfazer (Ctrl+Z)">
            <Undo2 size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} title="Refazer (Ctrl+Y)">
            <Redo2 size={16} />
          </ToolbarButton>
          
          <div className="w-px h-5 bg-white/10 mx-1"></div>

          <select 
            className="bg-[#1a1a24] border border-white/10 text-gray-200 text-xs rounded-md px-2 py-1.5 outline-none hover:bg-[#2a2a35] focus:border-purple-500/50 transition-colors cursor-pointer"
            onChange={(e) => {
              if (e.target.value === 'p') editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) as any }).run();
            }}
            title="Tamanho do Bloco"
          >
            <option value="p">Texto Normal</option>
            <option value="1">Título Gigante (H1)</option>
            <option value="2">Título Grande (H2)</option>
            <option value="3">Título Médio (H3)</option>
          </select>

          <select 
            className="bg-[#1a1a24] border border-white/10 text-gray-200 text-xs rounded-md px-2 py-1.5 outline-none hover:bg-[#2a2a35] focus:border-purple-500/50 w-28 transition-colors cursor-pointer"
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            title="Fonte de Escrita"
          >
            <option value="Inter">Fonte Padrão</option>
            <option value="Arial">Arial</option>
            <option value="Comic Sans MS">Comic Sans</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>

          <div className="w-px h-5 bg-white/10 mx-1"></div>

          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Negrito (Ctrl+B)">
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Itálico (Ctrl+I)">
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Sublinhado (Ctrl+U)">
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Tachado">
            <Strikethrough size={16} />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1"></div>

          <div className="relative flex items-center justify-center p-1.5 transition-all duration-200 active:scale-90 hover:scale-105 hover:bg-white/10 rounded-md cursor-pointer group hover:z-[9999]" title="Cor da Letra">
            <Type size={16} className="text-gray-400 group-hover:text-white transition-colors" />
            <input type="color" onInput={(e: any) => editor.chain().focus().setColor(e.target.value).run()} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 backdrop-blur-xl text-white text-xs py-1.5 px-3 rounded-lg shadow-2xl border border-white/20 z-[99999]">
              Cor da Letra
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-b border-r border-white/20 rotate-45"></div>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center p-1.5 transition-all duration-200 active:scale-90 hover:scale-105 hover:bg-white/10 rounded-md cursor-pointer group hover:z-[9999]" title="Cor do Fundo (Marca-texto)">
            <PaintBucket size={16} className="text-gray-400 group-hover:text-white transition-colors" />
            <input type="color" onInput={(e: any) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 backdrop-blur-xl text-white text-xs py-1.5 px-3 rounded-lg shadow-2xl border border-white/20 z-[99999]">
              Cor do Fundo (Marca-texto)
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-b border-r border-white/20 rotate-45"></div>
            </div>
          </div>

          <div className="w-px h-5 bg-white/10 mx-1"></div>
          
          <ToolbarButton onClick={openLinkModal} isActive={editor.isActive('link')} title="Adicionar Link (URL)">
            <LinkIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => setModalState('image')} title="Adicionar Imagem">
            <ImageIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => setModalState('youtube')} title="Anexar Vídeo do YouTube">
            <YoutubeIcon size={16} className="text-red-400" />
          </ToolbarButton>
        </div>

        {/* Linha Inferior */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Lista Pontilhada">
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Lista Numerada">
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Lista de Tarefas (Checklist)">
            <CheckSquare size={16} />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1"></div>

          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Alinhar à Esquerda">
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Alinhar ao Centro">
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Alinhar à Direita">
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justificar Texto">
            <AlignJustify size={16} />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1"></div>

          <ToolbarButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} title="Avançar Recuo (Só funciona DENTRO de uma lista!)">
            <Indent size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} title="Diminuir Recuo (Voltar lista para trás)">
            <Outdent size={16} />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1"></div>

          <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Vassoura Mágica (Limpa formatações estranhas)">
            <Eraser size={16} />
          </ToolbarButton>
        </div>
      </div>

      {/* --- MODAIS --- */}
      <EditorModal isOpen={modalState === 'link'} onClose={() => setModalState(null)} title="Adicionar Link">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">URL do Link</label>
            <input 
              autoFocus
              type="url" 
              placeholder="https://..." 
              value={linkUrl} 
              onChange={e => setLinkUrl(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          {editor.state.selection.empty && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Texto de Exibição (Opcional)</label>
              <input 
                type="text" 
                placeholder="Clique Aqui" 
                value={linkText} 
                onChange={e => setLinkText(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setModalState(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleLinkSubmit} className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors shadow-lg">Aplicar</button>
          </div>
        </div>
      </EditorModal>

      <EditorModal isOpen={modalState === 'image'} onClose={() => setModalState(null)} title="Adicionar Imagem">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl text-gray-300 hover:text-white transition-colors"
          >
            <UploadCloud size={20} />
            Escolher Arquivo do Computador
          </button>
          
          <div className="flex items-center gap-2">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-gray-500">OU</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Colar URL Externa</label>
            <input 
              type="url" 
              placeholder="https://.../imagem.jpg" 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setModalState(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleImageSubmit} className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors shadow-lg">Inserir URL</button>
          </div>
        </div>
      </EditorModal>

      <EditorModal isOpen={modalState === 'youtube'} onClose={() => setModalState(null)} title="Anexar Vídeo YouTube">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Link do YouTube</label>
            <input 
              autoFocus
              type="url" 
              placeholder="https://youtube.com/watch?v=..." 
              value={ytUrl} 
              onChange={e => setYtUrl(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Largura</label>
              <input 
                type="number" 
                value={ytWidth} 
                onChange={e => setYtWidth(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Altura</label>
              <input 
                type="number" 
                value={ytHeight} 
                onChange={e => setYtHeight(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setModalState(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleYoutubeSubmit} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors shadow-lg">Embutir Vídeo</button>
          </div>
        </div>
      </EditorModal>
    </>
  );
};

interface OracleEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function OracleEditor({ value, onChange, placeholder = "O que os astros sussurraram para você hoje?", minHeight = "200px" }: OracleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      TextStyle,
      FontFamily,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Youtube.configure({ inline: false }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `prose prose-invert prose-p:my-2 prose-h1:text-4xl prose-h2:text-2xl prose-a:text-purple-400 prose-a:cursor-pointer prose-a:underline prose-li:my-1 prose-ul:my-2 prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-5 prose-ul:list-disc prose-ul:pl-5 max-w-none focus:outline-none p-5 text-sm`,
        style: `min-height: ${minHeight}`
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl focus-within:border-purple-500/50 transition-colors shadow-inner relative z-0">
      <MenuBar editor={editor} />
      <div className="bg-transparent text-gray-200" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
