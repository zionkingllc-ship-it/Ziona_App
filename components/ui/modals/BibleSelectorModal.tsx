import React, { memo, useEffect, useMemo, useState } from "react";
import BaseModal from "./BaseModal";
import ScriptureReaderModal from "./ScriptureReaderModal";
import SelectChip from "./SelectChip";
import TranslationDropdown from "./TranslationDropdown";

//import { MockBibleRepository } from "@/repository/mockBibleRepository";
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
  remainingChars?: number;
  onLimitExceeded?: (remaining: number) => void;
}

export default function BibleSelectorModal({
  visible,
  onClose,
  onDone,
  remainingChars = 500,
  onLimitExceeded,
}: Props) {
  /* =========================
     REPOSITORY (SWITCH POINT)
  ========================= */

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

  /* =========================
     SELECTION STATE
  ========================= */

  const [translation, setTranslation] = useState("KJV");
  const [book, setBook] = useState<BibleBook | null>(null);
  const [chapter, setChapter] = useState<number | undefined>();
  const [verse, setVerse] = useState<number | undefined>();

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
    } catch {
      console.log("Failed to load translations");
    }
  }

  async function loadBooks() {
    try {
      const data = await repository.getBooks();
      setBooks(data);
    } catch {
      console.log("Failed to load books");
    }
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
    } catch {
      console.log("Failed to load chapters");
    }
  }

  /* =========================
     LOAD VERSES
  ========================= */

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
      const data = await repository.getVerses(version, bookName, chapter);
      setVerses(data);
    } catch {
      console.log("Failed to load verses");
    }
  }

  /* =========================
     RESET LOGIC
  ========================= */

  useEffect(() => {
    if (!visible) {
      setTranslation("KJV");
      setBook(null);
      setChapter(undefined);
      setVerse(undefined);
      setSelected([]);
      setSearch("");
      setTranslationOpen(false);
      setReaderOpen(false);
    }
  }, [visible]);

  function resetAll() {
    setBook(null);
    setChapter(undefined);
    setVerse(undefined);
    setSelected([]);
    setSearch("");
  }

  function resetBookLevel() {
    setChapter(undefined);
    setVerse(undefined);
    setSelected([]);
    setSearch("");
  }

  /* =========================
     FILTER LOGIC
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
     VERSE SELECTION
  ========================= */

  function toggleVerse(v: number) {
    setSelected((prev) =>
      prev.includes(v) ? prev.filter((i) => i !== v) : [...prev, v],
    );
  }

  function selectVerse(v: number) {
    setVerse(v);
    setSelected([v]);
    setSearch("");
    setReaderOpen(true);
  }

  return (
    <BaseModal visible={visible} onClose={onClose} alignBottom>
      <View style={styles.sheet}>
        <XStack justifyContent="space-between" marginBottom={10}>
          <Text fontFamily={"$body"} fontWeight="400" fontSize={16}>
            Add Bible
          </Text>
          <CloseButton onPress={onClose} size={24} />
        </XStack>

        <XStack gap="$2" justifyContent="center" marginBottom={20}>
          <SelectChip
            label={translation}
            active
            onPress={() => {
              resetAll();
              setTranslationOpen(true);
            }}
          />

          <SelectChip
            label={book?.name || "BOOKS"}
            active={!!book}
            onPress={() => {
              if (book) resetAll();
            }}
          />

          <SelectChip
            label={chapter ? String(chapter) : "CHAPTER"}
            active={!!chapter}
            onPress={() => {
              if (chapter) resetBookLevel();
            }}
          />

          <SelectChip
            label={verse ? String(verse) : "VERSE"}
            active={!!verse}
            onPress={() => {
              if (verse) setReaderOpen(true);
            }}
          />
        </XStack>

        <XStack style={styles.searchContainer}>
          <Search size={16} color="#777" />

          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { fontFamily: "$body" }]}
          />
        </XStack>

        {!book && (
          <>
            <XStack marginVertical={10}>
              <Pressable
                style={[styles.tab, testament === "old" && styles.activeTab]}
                onPress={() => setTestament("old")}
              >
                <Text fontFamily={"$body"}>Old Testament</Text>
              </Pressable>

              <Pressable
                style={[styles.tab, testament === "new" && styles.activeTab]}
                onPress={() => setTestament("new")}
              >
                <Text fontFamily={"$body"}>New Testament</Text>
              </Pressable>
            </XStack>

            <FlatList
              data={filteredBooks}
              keyExtractor={(item) => item.slug}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    setBook(item);
                    setSearch("");
                  }}
                >
                  <Text fontFamily={"$body"}>{item.name}</Text>
                </Pressable>
              )}
            />
          </>
        )}

        {book && !chapter && (
          <FlatList
            data={filteredChapters}
            keyExtractor={(item) => String(item)}
            renderItem={({ item }) => (
              <Pressable
                style={styles.row}
                onPress={() => {
                  setChapter(item);
                  setSearch("");
                }}
              >
                <Text fontFamily={"$body"}>{item}</Text>
              </Pressable>
            )}
          />
        )}

        {book && chapter && !verse && (
          <FlatList
            data={filteredVerses}
            keyExtractor={(item) => String(item.number)}
            renderItem={({ item }) => (
              <VerseRow
                verse={item}
                active={verse === item.number}
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
  visible={readerOpen}
  verses={verses}
  selected={selected}
  reference={`${book?.name ?? ""} ${chapter ?? ""}`}
  translation={translation}
  book={book?.name ?? ""}
  chapter={chapter}
  onToggle={toggleVerse}
  onClose={() => setReaderOpen(false)}
  onDone={(numbers) => {
    const ordered = [...numbers].sort((a, b) => a - b);

    const text = verses
      .filter((v) => ordered.includes(v.number))
      .map((v) => v.text)
      .join(" ");

    if (!chapter || !book) return;

    onDone({
      translation,
      book: book.name,
      chapter,
      verses: ordered,
      text,
    });

    setReaderOpen(false);
    onClose();
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

  tab: { flex: 1, padding: 10, alignItems: "center" },

  activeTab: { backgroundColor: "#EAD9F3", borderRadius: 8 },

  row: { paddingVertical: 12 },

  verseSelected: { backgroundColor: "black" },

  done: {
    backgroundColor: "#7A2E8A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
