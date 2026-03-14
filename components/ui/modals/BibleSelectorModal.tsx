import BaseModal from "./BaseModal";
import ScriptureReaderModal from "./ScriptureReaderModal";
import SelectChip from "./SelectChip";
import TranslationDropdown from "./TranslationDropdown";

import { BibleBook, BibleTranslation, BibleVerse } from "@/types/bible";

import { Search, X } from "@tamagui/lucide-icons";
import { useEffect, useMemo, useState } from "react";

import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

import { Text, View, XStack } from "tamagui";

const { height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  verses?: BibleVerse[];
  translations?: BibleTranslation[];
  books?: BibleBook[];
  chapters?: number[];
  onClose: () => void;
  onDone: (data: {
    translation: string;
    book: string;
    chapter?: number;
    verses: number[];
    text: string;
  }) => void;
}

export default function BibleSelectorModal({
  visible,
  verses = [],
  translations = [],
  books = [],
  chapters = [],
  onClose,
  onDone,
}: Props) {
  const [translation, setTranslation] = useState("KJV");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState<number | undefined>();
  const [verse, setVerse] = useState<number | undefined>();

  const [selected, setSelected] = useState<number[]>([]);

  const [translationOpen, setTranslationOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [testament, setTestament] = useState<"old" | "new">("old");

  /* RESET */

  useEffect(() => {
    if (!visible) {
      setTranslation("KJV");
      setBook("");
      setChapter(undefined);
      setVerse(undefined);
      setSelected([]);
      setSearch("");
      setTranslationOpen(false);
      setReaderOpen(false);
    }
  }, [visible]);

  /* BOOK FILTER */

  const filteredBooks = useMemo(() => {
    return books.filter(
      (b) =>
        b.testament === testament &&
        b.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [books, search, testament]);

  /* CHAPTER FILTER */

  const filteredChapters = useMemo(() => {
    if (!search) return chapters;

    return chapters.filter((c) => String(c).includes(search));
  }, [chapters, search]);

  /* VERSE FILTER */

  const filteredVerses = useMemo(() => {
    if (!search) return verses;

    return verses.filter(
      (v) =>
        v.text.toLowerCase().includes(search.toLowerCase()) ||
        String(v.number).includes(search),
    );
  }, [verses, search]);

  /* TOGGLE VERSE (reader) */

  function toggleVerse(v: number) {
    setSelected((prev) =>
      prev.includes(v) ? prev.filter((i) => i !== v) : [...prev, v],
    );
  }

  /* SELECT VERSE (selector step) */
  function selectVerse(v: number) {
    setVerse(v);
    setSelected([v]);
    setSearch("");
    setReaderOpen(true);
  }
  /* DONE */

  function finish() {
    const ordered = [...selected].sort((a, b) => a - b);

    const text = verses
      .filter((v) => ordered.includes(v.number))
      .map((v) => v.text)
      .join(" ");

    onDone({
      translation,
      book,
      chapter,
      verses: ordered,
      text,
    });
  }

  function resetAll() {
    setBook("");
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

  function resetChapterLevel() {
    setVerse(undefined);
    setSelected([]);
    setSearch("");
  }
  return (
    <BaseModal visible={visible} onClose={onClose} alignBottom>
      <View style={styles.sheet}>
        {/* HEADER */}

        <XStack justifyContent="space-between" marginBottom={10}>
          <Text fontFamily={"$body"} fontWeight="600">
            Add Bible
          </Text>

          <Pressable onPress={onClose}>
            <X size={16} />
          </Pressable>
        </XStack>

        {/* CHIPS */}

        <XStack gap="$2" marginBottom={20}>
          <SelectChip
            label={translation}
            active
            onPress={() => {
              resetAll();
              setTranslationOpen(true);
            }}
          />

          <SelectChip
            label={book || "BOOKS"}
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

        {/* SEARCH */}

        <XStack style={styles.searchContainer}>
          <Search size={16} color="#777" />

          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </XStack>

        {/* BOOKS */}

        {!book && (
          <>
            <XStack marginVertical={10}>
              <Pressable
                style={[styles.tab, testament === "old" && styles.activeTab]}
                onPress={() => setTestament("old")}
              >
                <Text>Old Testament</Text>
              </Pressable>

              <Pressable
                style={[styles.tab, testament === "new" && styles.activeTab]}
                onPress={() => setTestament("new")}
              >
                <Text>New Testament</Text>
              </Pressable>
            </XStack>

            <FlatList
              data={filteredBooks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    setBook(item.name);
                    setSearch("");
                  }}
                >
                  <Text>{item.name}</Text>
                </Pressable>
              )}
            />
          </>
        )}

        {/* CHAPTER LIST */}

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
                <Text>{item}</Text>
              </Pressable>
            )}
          />
        )}

        {/* VERSE LIST */}

        {book && chapter && !verse && (
          <FlatList
            data={filteredVerses}
            keyExtractor={(item) => String(item.number)}
            renderItem={({ item }) => {
              const active = verse === item.number;

              return (
                <Pressable
                  style={[styles.row, active && styles.verseSelected]}
                  onPress={() => selectVerse(item.number)}
                >
                  <Text fontWeight="700">{item.number}</Text>
                </Pressable>
              );
            }}
          />
        )}
        {/* TRANSLATION */}

        <TranslationDropdown
          visible={translationOpen}
          options={translations.map((t) => t.name)}
          onSelect={(v) => {
            setTranslation(v);
            setTranslationOpen(false);
          }}
        />
      </View>

      {/* READER */}

      <ScriptureReaderModal
        visible={readerOpen}
        verses={verses}
        selected={selected}
        reference={`${book} ${chapter ?? ""}`}
        translation={translation}
        book={book}
        chapter={chapter}
        onToggle={toggleVerse}
        onClose={() => setReaderOpen(false)}
        onDone={(numbers) => {
          const ordered = [...numbers].sort((a, b) => a - b);

          const text = verses
            .filter((v) => ordered.includes(v.number))
            .map((v) => v.text)
            .join(" ");

          onDone({
            translation,
            book,
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
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 8,
  },

  searchInput: {
    flex: 1,
  },

  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#EAD9F3",
    borderRadius: 8,
  },

  row: {
    paddingVertical: 12,
  },

  verseSelected: {
    backgroundColor: "black",
  },

  done: {
    backgroundColor: "#7A2E8A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
