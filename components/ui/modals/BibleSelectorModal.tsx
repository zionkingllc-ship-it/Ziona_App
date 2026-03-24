import React, { memo, useEffect, useMemo, useState } from "react";
import BaseModal from "./BaseModal";
import ScriptureReaderModal from "./ScriptureReaderModal";
import SelectChip from "./SelectChip";
import TranslationDropdown from "./TranslationDropdown";

import { GraphqlBibleRepository } from "@/repository/graphql/GraphqlBibleRepository";
import { BibleBook, BibleTranslation, BibleVerse } from "@/types/bible";

import { Search } from "@tamagui/lucide-icons";

import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

import { Text, View, XStack } from "tamagui";
import CloseButton from "../CloseButton";

const { height } = Dimensions.get("window");

/* =========================
   MEMOIZED VERSE ROW
========================= */

const VerseRow = memo(
  ({
    verse,
    onPress,
    active,
  }: {
    verse: BibleVerse;
    onPress: () => void;
    active?: boolean;
  }) => {
    return (
      <Pressable
        style={[styles.row, active && styles.verseSelected]}
        onPress={onPress}
      >
        <Text
          fontFamily={"$body"}
          fontWeight="400"
          color={active ? "white" : "black"}
        >
          {verse.number}
        </Text>
      </Pressable>
    );
  },
);

interface Props {
  visible: boolean;
  onClose: () => void;

  onDone: (data: {
    translation: string;
    book: string;
    chapter: number;
    verses: number[];
    text: string;
  }) => void;
}

export default function BibleSelectorModal({
  visible,
  onClose,
  onDone,
}: Props) {
  const repository = useMemo(() => {
    return new GraphqlBibleRepository();
  }, []);

  /* =========================
     DATA STATE
  ========================= */

  const [translations, setTranslations] = useState<BibleTranslation[]>([]);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<number[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  /* =========================
     SELECTION STATE
  ========================= */

  const [translation, setTranslation] = useState("KJV");
  const [book, setBook] = useState<BibleBook | null>(null);
  const [chapter, setChapter] = useState<number | undefined>();
  const [selected, setSelected] = useState<number[]>([]);

  const [translationOpen, setTranslationOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [testament, setTestament] = useState<"old" | "new">("old");

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    if (!visible) return;
    loadTranslations();
    loadBooks();
  }, [visible]);

  async function loadTranslations() {
    try {
      const data = await repository.getTranslations();
      setTranslations(data);
    } catch {}
  }

  async function loadBooks() {
    try {
      const data = await repository.getBooks();
      setBooks(data);
    } catch {}
  }

  /* =========================
     LOAD CHAPTERS
  ========================= */

  useEffect(() => {
    if (!book) return;
    loadChapters(book);
  }, [book]);

  async function loadChapters(selectedBook: BibleBook) {
    try {
      const data = await repository.getChapters(selectedBook);
      setChapters(data);
    } catch {}
  }

  /* =========================
     LOAD VERSES
  ========================= */
useEffect(() => {
  if (!visible) return;

  // force clean start every time modal opens
  setBook(null);
  setChapter(undefined);
  setSelected([]);
  setVerses([]);
  setSearch("");
}, [visible]);
  useEffect(() => {
    if (!chapter || !book) return;
    loadVerses(book.name, chapter, translation);
  }, [chapter, book, translation]);

  async function loadVerses(
    bookName: string,
    chapter: number,
    version: string,
  ) {
    try {
      setLoadingVerses(true);
      const data = await repository.getVerses(version, bookName, chapter);
      setVerses(data);
    } catch {
      console.log("Failed to load verses");
    } finally {
      setLoadingVerses(false);
    }
  }

  /* =========================
     FILTER
  ========================= */

  const filteredBooks = useMemo(() => {
    return books.filter(
      (b) =>
        b.testament === testament &&
        b.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [books, search, testament]);

  const filteredChapters = useMemo(() => {
    if (!search) return chapters;
    return chapters.filter((c) => String(c).includes(search));
  }, [chapters, search]);

  const filteredVerses = useMemo(() => {
    if (!search) return verses;
    const s = search.toLowerCase();
    return verses.filter(
      (v) => v.text.toLowerCase().includes(s) || String(v.number).includes(s),
    );
  }, [verses, search]);

  /* =========================
     SELECTION
  ========================= */

  function toggleVerse(v: number) {
    setSelected((prev) =>
      prev.includes(v) ? prev.filter((i) => i !== v) : [...prev, v],
    );
  }

  function selectVerse(v: number) {
    if (loadingVerses || verses.length === 0) return;

    setSelected([v]);
    setSearch("");
    setReaderOpen(true);
  }

  return (
    <BaseModal visible={visible} onClose={onClose} alignBottom>
      <View style={styles.sheet}>
        <XStack justifyContent="space-between" marginBottom={10}>
          <Text fontFamily={"$body"} fontSize={16}>
            Add Bible
          </Text>
          <CloseButton onPress={onClose} size={24} />
        </XStack>

        {/* SELECTORS */}
        <XStack gap="$2" justifyContent="center" marginBottom={20}>
          {/* TRANSLATION */}
          <SelectChip
            label={translation}
            active
            onPress={() => {
              setBook(null);
              setChapter(undefined);
              setSelected([]);
              setTranslationOpen(true);
            }}
          />

          {/* BOOK */}
          <SelectChip
            label={book?.name || "BOOKS"}
            active={!!book}
            onPress={() => {
              if (book) {
                setBook(null);
                setChapter(undefined);
                setSelected([]);
              }
            }}
          />

          {/* CHAPTER */}
          <SelectChip
            label={chapter ? String(chapter) : "CHAPTER"}
            active={!!chapter}
            onPress={() => {
              if (chapter) {
                setChapter(undefined);
                setSelected([]);
              }
            }}
          />

          {/* VERSE */}
          <SelectChip
            label={
              selected.length > 0
                ? selected.length === 1
                  ? String(selected[0])
                  : `${selected[0]}-${selected[selected.length - 1]}`
                : "VERSE"
            }
            active={selected.length > 0}
            onPress={() => {
              if (selected.length > 0 && !loadingVerses) {
                setReaderOpen(true);
              }
            }}
          />
        </XStack>

        {/* SEARCH */}
        <XStack style={styles.searchContainer}>
          <Search size={16} color="#777" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholder="start typing..."
          />
        </XStack>

        {/* BOOKS */}
        {!book && (
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => setBook(item)}>
                <Text>{item.name}</Text>
              </Pressable>
            )}
          />
        )}

        {/* CHAPTERS */}
        {book && !chapter && (
          <FlatList
            data={filteredChapters}
            keyExtractor={(item) => String(item)}
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => setChapter(item)}>
                <Text>{item}</Text>
              </Pressable>
            )}
          />
        )}

        {/* VERSES */}
        {book && chapter && (
          <FlatList
            data={filteredVerses}
            keyExtractor={(item) => String(item.number)}
            renderItem={({ item }) => (
              <VerseRow
                verse={item}
                active={selected.includes(item.number)}
                onPress={() => selectVerse(item.number)}
              />
            )}
          />
        )}

        <TranslationDropdown
          visible={translationOpen}
          options={translations.map((t) => t.name)}
          onSelect={(v) => {
            setTranslation(v);
            setTranslationOpen(false);
          }}
        />
      </View>

      <ScriptureReaderModal
        visible={readerOpen && !loadingVerses}
        verses={verses}
        selected={selected}
        reference={`${book?.name ?? ""} ${chapter ?? ""}`}
        translation={translation}
        book={book?.name ?? ""}
        chapter={chapter}
        onToggle={toggleVerse}
        onClose={() => setReaderOpen(false)}
        onDone={async (numbers) => {
          const ordered = [...numbers].sort((a, b) => a - b);

          if (!chapter || !book || ordered.length === 0) return;

          try {
            const scripture = await repository.getScripture({
              book: book.name,
              chapter,
              version: translation,
            });

            const selectedVerses = (scripture.verses || []).filter((v: any) =>
              ordered.includes(v.number),
            );

            const text = selectedVerses.map((v: any) => v.text).join(" ");

            onDone({
              translation,
              book: scripture.book,
              chapter: scripture.chapter,
              verses: ordered,
              text,
            });

            setReaderOpen(false);
            onClose();
          } catch (err) {
            console.log("Failed to fetch scripture", err);
          }
        }}
      />
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    height: height * 0.72,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  searchContainer: {
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 8,
    borderWidth: 0.5,
    borderColor: "#EEEBEF",
  },
  searchInput: { flex: 1 },
  row: { paddingVertical: 12 },
  verseSelected: { backgroundColor: "black" },
});
