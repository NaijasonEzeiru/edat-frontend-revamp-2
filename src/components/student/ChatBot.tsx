import { useLazyAiPromptQuery } from "@/services/studentApi";
import { useEffect, useRef, useState } from "react";
import { BiSolidSend } from "react-icons/bi";
import { FaRobot } from "react-icons/fa";
import { Button } from "../ui/button";

function ChatBot({ name }: { name: string }) {
  const [chat, setChat] = useState<Record<string, string>[]>([]);
  const [showDiv, setShowDiv] = useState("ask edat");
  const [question, setQuestion] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [prompt, { isLoading, data, isSuccess }] = useLazyAiPromptQuery();

  //   function scrollToBottom() {
  //     const scrollHeight = bottomRef.current?.scrollHeight;
  //     const clientHeight = bottomRef.current?.clientHeight;
  //     const maxScrollTop = scrollHeight + clientHeight;
  //     bottomRef.current.scrollTop = 30;
  //   }

  useEffect(() => {
    setChat([
      { bot: `Hello ${name}` },
      { bot: "How can I help you?" },
      // {
      //   you: "Just for test Just for test Just for test Just for test Just for Just for test Just for test Just for test Just for test Just for",
      // },
    ]);
  }, [name]);

  function handleQuestionSubmit() {
    if (question.length > 0) {
      const q = question;
      setQuestion("");
      setChat((prev) => [...prev, { you: q }]);
      prompt({ myPrompt: q });
      //   bottomRef.current?.scrollIntoView({
      //     behavior: "smooth",
      //     block: "end",
      //   });
    }
  }

  useEffect(() => {
    if (isSuccess) {
      console.log({ data });
      setChat((prev) => [...prev, { bot: data }]);
    }
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [data, isLoading, isSuccess]);

  return (
    <div className="fixed bottom-3 right-6">
      {showDiv == "divya" && <DiyvaBot setShowDiyvaBot={setShowDiv} />}
      {showDiv == "ask edat" && (
        <button
          className="text-3xl flex flex-col items-center p-3 bg-[#22222222] rounded-full text-[#00327f]"
          onClick={() => setShowDiv("select bot")}
        >
          <FaRobot />
          <p className="text-sm">Ask EDAT</p>
        </button>
      )}
      {showDiv == "select bot" && (
        <div className="flex flex-col gap-2">
          <Button onClick={() => setShowDiv("divya")}>Diyva Bot</Button>
          <Button onClick={() => setShowDiv("edat bot")}>Edat Bot</Button>
        </div>
      )}
      {showDiv == "edat bot" && (
        <div className="relative h-72 w-80 rounded-md bg-[#7cc5b9] flex flex-col">
          <div className="h-8 w-full relative z-50">
            <button
              className="absolute size-6 top-1 bg-[#00327f] text-white rounded-full z-40 right-3"
              onClick={() => setShowDiv("ask edat")}
            >
              X
            </button>
          </div>
          <div className="flex flex-col gap-2 mx-3 h-64 overflow-y-auto">
            {chat.map((e, i) => (
              <p
                className={`bg-white px-4 py-1 w-fit rounded-lg max-w-[90%] ${
                  e.you && "self-end"
                }`}
                key={i}
              >
                {e.bot || e.you}
              </p>
            ))}
            {!!isLoading && (
              <div className="bg-white px-4 py-1 w-fit rounded-lg max-w-[90%]">
                <p className="animate-bounce text-lg">...</p>
              </div>
            )}
            <div className="bg-fuchsia-700 px-4 py-1 rounded-lg max-w-[90%] h-6 opacity-0"></div>
            <div
              className="bg-fuchsia-700 px-4 py-1 rounded-lg max-w-[90%] h-6 opacity-0"
              ref={bottomRef}
            >
              <p>Ref</p>
            </div>
          </div>
          <div className="w-80 h-12 bg-slate-200 flex gap-2 px-4 items-center">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="h-8 !rounded-xl w-64 px-2"
            />
            <button
              disabled={isLoading}
              className={`size-8 rounded-full text-white bg-[#00327f] flex items-center justify-center ${
                isLoading && "opacity-50"
              }`}
              onClick={() => {
                handleQuestionSubmit();
              }}
            >
              <BiSolidSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;

function DiyvaBot({ setShowDiyvaBot }) {
  return (
    <div
      className={`w-8/12 h-[calc(30vw+34px)] fixed bottom-0 right-0
      }`}
    >
      <span className="bg-white p-2 flex justify-between">
        <p>EDATECH</p>
        <button
          className="text-red-600 font-semibold"
          onClick={() => setShowDiyvaBot("ask edat")}
        >
          X
        </button>
      </span>
      <iframe
        src="https://webui.test.diyva.life/chatbotui/index.html?dialog_id=4fb7f678-bb2d-4d1b-a33d-22a6961d7efb"
        title="description"
        className="w-full h-full"
      ></iframe>
    </div>
  );
}
