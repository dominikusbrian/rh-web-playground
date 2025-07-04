import { useState, useEffect, useCallback, useRef } from 'react';
import { NoteService, NoteError } from '@/services/note.service';
import type { NoteWithContent, Note, NoteAccess, NoteContent } from '@/types/note';
import { ID } from '@/types/root';
import { Editor } from '@tiptap/react';
import { debounce, DebouncedFunc } from 'lodash';
import { getDocumentTitleFromEditor } from '@/components/Editor/lib/utils/documentTitle';

export interface UseNoteOptions {
  sendImmediately?: boolean;
}

interface UseNoteState {
  note: NoteWithContent | null;
  isLoading: boolean;
  error: Error | null;
}

type FetchNoteFn = () => Promise<void>;
type UseNoteReturn = [UseNoteState, FetchNoteFn];

/**
 * Custom hook to fetch and manage note data.
 * Accepts an optional initialNote to prevent unnecessary fetching when data is already available.
 *
 * TODO: Future Collaboration Implementation
 * This hook will be updated to use TipTap's collaboration features:
 * 1. Initialize Y.js document
 * 2. Configure TipTap collaboration extension
 * 3. Set up WebSocket connection via TiptapCollabProvider
 * 4. Handle real-time updates and presence
 *
 * Example future implementation:
 * ```typescript
 * const doc = new Y.Doc();
 * const editor = useEditor({
 *   extensions: [
 *     StarterKit.configure({ history: false }), // Disable for collaboration
 *     Collaboration.configure({ document: doc }),
 *     // Add cursor presence, etc.
 *   ],
 * });
 * ```
 *
 * @param noteId - The ID of the note to fetch
 * @returns UseNoteReturn object containing note data and loading state
 */
export function useNote(
  noteId: string,
  options: UseNoteOptions = { sendImmediately: true }
): UseNoteReturn {
  const [note, setNote] = useState<NoteWithContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const noteData = await NoteService.getNote(noteId);
      setNote(noteData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch note'));
      setNote(null);
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    if (options.sendImmediately !== false) {
      fetch();
    }
  }, [fetch, options.sendImmediately]);

  return [{ note, isLoading, error }, fetch];
}

interface CreateNoteInput {
  title: string;
  grouping: NoteAccess;
  organizationSlug: string;
}

interface UseCreateNoteState {
  note: Note | null;
  isLoading: boolean;
  error: Error | null;
}

type CreateNoteFn = (params: CreateNoteInput) => Promise<Note>;
type UseCreateNoteReturn = [UseCreateNoteState, CreateNoteFn];

export const useCreateNote = (): UseCreateNoteReturn => {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNote = async (params: CreateNoteInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await NoteService.createNote({
        title: params.title,
        grouping: params.grouping,
        organization_slug: params.organizationSlug,
      });
      setNote(response);
      return response;
    } catch (err) {
      const errorMsg = err instanceof NoteError ? err.message : 'Failed to create note';
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [{ note, isLoading, error }, createNote];
};

interface UseNoteContentState {
  note: NoteContent | null;
  isLoading: boolean;
  error: Error | null;
}

interface UpdateNoteContentInput {
  note: ID;
  fullSrc?: string;
  plainText?: string;
  fullJson?: string;
}

type UpdateNoteContentFn = (params: UpdateNoteContentInput) => Promise<NoteContent>;
type UseNoteContentReturn = [UseNoteContentState, UpdateNoteContentFn];

export const useNoteContent = (): UseNoteContentReturn => {
  const [note, setNote] = useState<NoteContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateNoteContent = async (params: UpdateNoteContentInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await NoteService.updateNoteContent({
        note: params.note,
        full_src: params.fullSrc,
        plain_text: params.plainText,
        full_json: params.fullJson,
      });
      setNote(response);
      return response;
    } catch (err) {
      const errorMsg = err instanceof NoteError ? err.message : 'Failed to update note content';
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [{ note, isLoading, error }, updateNoteContent];
};

interface UseDeleteNoteState {
  isLoading: boolean;
  error: Error | null;
}

type DeleteNoteFn = (noteId: ID) => Promise<Note>;
type UseDeleteNoteReturn = [UseDeleteNoteState, DeleteNoteFn];

export const useDeleteNote = (): UseDeleteNoteReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteNote = async (noteId: ID) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await NoteService.deleteNote(noteId);
      return response;
    } catch (err) {
      const errorMsg = err instanceof NoteError ? err.message : 'Failed to delete note';
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [{ isLoading, error }, deleteNote];
};

interface UseUpdateNoteState {
  isLoading: boolean;
  error: Error | null;
}

interface UpdateNoteOptions {
  onTitleUpdate?: (newTitle: string) => void;
  debounceMs?: number;
}

type UpdateNoteFn = (editor: Editor) => void;
type UseUpdateNoteReturn = [UseUpdateNoteState, UpdateNoteFn];

export const useUpdateNote = (noteId: ID, options: UpdateNoteOptions = {}): UseUpdateNoteReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const titleRef = useRef<string>('');

  const debouncedUpdate = useRef<DebouncedFunc<(editor: Editor, noteId: ID) => Promise<void>>>(
    debounce(async (editor: Editor, noteId: ID) => {
      if (!editor || !noteId) {
        console.error('Editor or noteId is undefined in debouncedUpdate', { editor, noteId });
        return;
      }

      const json = editor.getJSON();
      const html = editor.getHTML();
      const newTitle = getDocumentTitleFromEditor(editor) || '';

      setIsLoading(true);
      setError(null);

      try {
        const promises: Promise<any>[] = [];

        // Only update title if it changed
        if (newTitle !== titleRef.current) {
          titleRef.current = newTitle;
          promises.push(
            NoteService.updateNoteTitle({
              noteId,
              title: newTitle,
            }).then(() => {
              options.onTitleUpdate?.(newTitle);
            })
          );
        }

        // Always update content
        promises.push(
          NoteService.updateNoteContent({
            note: noteId,
            full_src: html || '',
            plain_text: editor.getText() || '',
            full_json: JSON.stringify(json),
          })
        );

        await Promise.all(promises);
      } catch (err) {
        const errorMsg = err instanceof NoteError ? err.message : 'Failed to update note';
        const error = new Error(errorMsg);
        setError(error);
        console.error('Error updating note:', error);
      } finally {
        setIsLoading(false);
      }
    }, options.debounceMs ?? 2000)
  );

  const updateNote = useCallback(
    (editor: Editor) => {
      if (!editor) {
        console.error('Editor is undefined in updateNote');
        return;
      }
      debouncedUpdate.current(editor, noteId);
    },
    [noteId]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.current.cancel();
    };
  }, []);

  return [{ isLoading, error }, updateNote];
};

interface UseMakeNotePrivateState {
  isLoading: boolean;
  error: Error | null;
}

type MakeNotePrivateFn = (noteId: ID) => Promise<Note>;
type UseMakeNotePrivateReturn = [UseMakeNotePrivateState, MakeNotePrivateFn];

export const useMakeNotePrivate = (): UseMakeNotePrivateReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const makeNotePrivate = async (noteId: ID) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await NoteService.makePrivate(noteId);
      return response;
    } catch (err) {
      const errorMsg = err instanceof NoteError ? err.message : 'Failed to make note private';
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [{ isLoading, error }, makeNotePrivate];
};

interface UpdateNotePermissionsInput {
  noteId: ID;
  organizationId: ID;
  accessType?: 'ADMIN';
}

interface UseUpdateNotePermissionsState {
  isLoading: boolean;
  error: Error | null;
}

type UpdateNotePermissionsFn = (params: UpdateNotePermissionsInput) => Promise<boolean>;
type UseUpdateNotePermissionsReturn = [UseUpdateNotePermissionsState, UpdateNotePermissionsFn];

export const useUpdateNotePermissions = (): UseUpdateNotePermissionsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePermissions = async (params: UpdateNotePermissionsInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await NoteService.updateNotePermissions(
        params.noteId,
        params.organizationId,
        params.accessType
      );
      return response;
    } catch (err) {
      const errorMsg = err instanceof NoteError ? err.message : 'Failed to update note permissions';
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [{ isLoading, error }, updatePermissions];
};

interface UseDuplicateNoteState {
  isLoading: boolean;
  error: Error | null;
}

type DuplicateNoteFn = (noteId: string, organizationSlug: string) => Promise<Note>;
type UseDuplicateNoteReturn = [UseDuplicateNoteState, DuplicateNoteFn];

export const useDuplicateNote = (): UseDuplicateNoteReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const duplicateNote = async (noteId: string, organizationSlug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Get the original note with content
      const originalNote = await NoteService.getNote(noteId);

      // 2. Create a new note with the same title
      const newNote = await NoteService.createNote({
        title: `${originalNote.title} (Copy)`,
        grouping: originalNote.access,
        organization_slug: organizationSlug,
      });

      // 3. Copy the content to the new note
      if (originalNote.content || originalNote.contentJson) {
        await NoteService.updateNoteContent({
          note: newNote.id,
          full_src: originalNote.content,
          plain_text: originalNote.plainText,
          full_json: originalNote.contentJson,
        });
      }

      return newNote;
    } catch (err) {
      const errorMsg = err instanceof NoteError ? err.message : 'Failed to duplicate note';
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [{ isLoading, error }, duplicateNote];
};
