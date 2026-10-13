<!-- ENTIRE FILE COMMENTED OUT -->
<!--

<script>
  import { onMount } from 'svelte';
  import { ai } from '$lib/assets';
  import { fade } from 'svelte/transition';
  /**
     * @type {string | any[]}
     */
  let messages = [];
  let inputMessage = '';
  let isOpen = false;
  let isLoading = false;
  /**
     * @type {HTMLDivElement}
     */
  let chatContainer;
  let sessionID = '';

  // N8N Webhook URL
  const WEBHOOK_URL = 'https://indqchatbot.zmake.in/webhook/69c9ffd9-a03b-4aa5-84b7-80688c58fc83/chat';

  // Generate unique session ID when component loads
  onMount(() => {
    sessionID = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    console.log('Generated Session ID:', sessionID);
  });


  // Auto-scroll to bottom when new messages arrive
  function scrollToBottom() {
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 50);
    }
  }

  $: if (messages.length > 0) {
    scrollToBottom();
  }

  async function sendMessage() {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    inputMessage = '';

    // Add user message to chat
    messages = [...messages, {
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    }];

    isLoading = true;

    try {
      const payload = {
        sessionId: sessionID,
        action: "sendMessage",
        chatInput: userMessage,
      };

      console.log('Sending to N8N:', payload);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('N8N Response:', data);

      // N8N might return different response formats, try multiple paths
      let botMessage = '';
      if (typeof data === 'string') {
        botMessage = data;
      } else if (data.output || data.response || data.message || data.text || data.reply || data.answer) {
        botMessage = data.output || data.response || data.message || data.text || data.reply || data.answer;
      } else if (Array.isArray(data) && data.length > 0) {
        // Sometimes N8N returns an array
        const firstItem = data[0];
        if (typeof firstItem === 'string') {
          botMessage = firstItem;
        } else {
          botMessage = firstItem.output || firstItem.response || firstItem.message || firstItem.text || firstItem.reply || firstItem.answer || JSON.stringify(firstItem);
        }
      } else {
        // Last resort - stringify the response
        botMessage = JSON.stringify(data);
      }

      if (!botMessage || botMessage.trim() === '') {
        botMessage = 'I received your message but got an empty response. Please try again.';
      }

      messages = [...messages, {
        text: botMessage,
        sender: 'bot',
        timestamp: new Date()
      }];

    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = 'Sorry, there was an error connecting to the chatbot.';

      // @ts-ignore
      if (error.message.includes('sessionID missing') || error.message.includes('session ID')) {
        errorMessage = 'Session error. Please refresh and try again.';
      }

      messages = [...messages, {
        text: errorMessage + ' Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }];
    } finally {
      isLoading = false;
    }
  }

  /**
     * @param {{ key: string; shiftKey: any; preventDefault: () => void; }} event
     */
  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens for the first time
      messages = [{
        text: "I'm here to help you explore our Human-centered health design services.?",
        sender: 'bot',
        timestamp: new Date()
      }];
      // Scroll after messages are added
      setTimeout(scrollToBottom, 100);
    }
  }

  /**
     * @param {{ toLocaleTimeString: (arg0: never[], arg1: { hour: string; minute: string; }) => any; }} timestamp
     */
  function formatTime(timestamp) {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

   let services = [
        "Product Design",
        "MedTech Device",
        "Our Projects",
        "Blogs",
        "MedTech ideas"
    ];

    let currentService = services[0];
    let index = 0;

    onMount(() => {
        const interval = setInterval(() => {
            index = (index + 1) % services.length;
            currentService = services[index];
        }, 3000);
        return () => clearInterval(interval);
    });

</script>
<!- - Chat Widget - ->
<div class="fixed bottom-16 right-16 z-50 ">
  <!- - Chat Window- ->
  {#if isOpen}
    <div class="mb-4
                  md:ml-0
                  ml-auto
                  w-80 h-120
                  md:w-80 md:h-96
                  lg:w-96 lg:h-[27rem]
      bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      <!- - Header - ->
        <div class="diagonal-gradient text-white p-4 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div class="w-12 h-12  bg-opacity-20 rounded-full flex items-center justify-center">
                    <img src= {ai} alt="Chatbot" class="w-9 h-9" />
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800">INDQ Studio AI, Pal</h3>
                    <p class="text-xs text-gray-600">Ask us about
                      <span class="transition-opacity duration-500 ease-in-out opacity-100">
                        {currentService}
                      </span>
                    </p>
                </div>
            </div>

            <!- - svelte-ignore a11y_consider_explicit_label - ->
            <button
            on:click={toggleChat}
            class="text-gray-800 hover:text-gray-600 transition-colors"
            >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            </button>
        </div>

      <!- - Messages Container - ->
      <div
        bind:this={chatContainer}
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {#each messages as message}
          <div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
            <div class="max-w-xs">
              <div class="flex items-end space-x-2 {message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}">
                <!- - Avatar - ->
                <div class="w-6 h-6 rounded-full flex-shrink-0 {message.sender === 'user' ? 'bg-gray-400' : 'bg-gray-400'} flex items-center justify-center">
                  {#if message.sender === 'user'}
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  {:else}
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                    </svg>
                  {/if}
                </div>

                <!- - Message Bubble - ->
                <div class="px-4 py-2 rounded-2xl {message.sender === 'user' ? 'diagonal-gradient text-gray-800' : 'bg-white text-gray-800 border border-gray-200'}">
                  <p class="text-sm">{message.text}</p>
                  <p class="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>
        {/each}

        <!- - Loading indicator - ->
        {#if isLoading}
          <div class="flex justify-start">
            <div class="max-w-xs">
              <div class="flex items-end space-x-2">
                <div class="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="px-4 py-2 rounded-2xl bg-white border border-gray-200">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!- - Input Area - ->
      <div class="p-4 bg-white border-t border-gray-200">
        <div class="flex space-x-2">
          <input
            bind:value={inputMessage}
            on:keypress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <!- - svelte-ignore a11y_consider_explicit_label - ->
          <button
            on:click={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            class="px-4 py-2 diagonal-gradient text-gray-800 rounded-full hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/if}

{#if !isOpen}
  <button
    on:click={toggleChat}
    class="w-14 h-14 diagonal-gradient hover:shadow-xl text-gray-800 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center relative"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
    </svg>
    <!- - Notification dot (optional) - ->
    <!- - <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div> - ->
  </button>
{/if}
</div>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
  }

</style>

-->


<script lang="ts">
  import { tick, onMount } from 'svelte';
  import { ai } from '$lib/assets';

  type Source = {
    title: string;
    url: string;
  };

  type Message = {
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
  };

  type MessagePart = {
    type: 'text' | 'link';
    value: string;
    label?: string;
  };

  type ChatResponse = {
    success?: boolean;
    answer?: string;
    reply?: string;
    output?: string;
    response?: string;
    message?: string;
    text?: string;
    error?: string;
    model?: string;
    status?: string;
    sources?: Source[];
  };

  let isOpen = false;
  let isLoading = false;
  let inputMessage = '';
  let chatContainer: HTMLDivElement;
  let messages: Message[] = [];

  // Unique session ID for each website visitor
  let sessionId = '';

  /*
   * n8n CHATBOT WEBHOOK
   *
   * For testing:
   * /webhook-test/indq-chatbot
   *
   * After activating workflow:
   * /webhook/indq-chatbot
   */
  const N8N_WEBHOOK_URL ='/api/chat';

  const suggestions = [
    'What services do you offer?',
    'Where are your studios?',
    'How do I start a project?'
  ];

  /*
   * Create one session ID per visitor/browser.
   *
   * Example:
   * 550e8400-e29b-41d4-a716-446655440000
   *
   * The same ID is used for future questions
   * from this visitor.
   */
  onMount(() => {
    let existingSessionId =
      localStorage.getItem('indq_chat_session');

    if (!existingSessionId) {
      existingSessionId = crypto.randomUUID();

      localStorage.setItem(
        'indq_chat_session',
        existingSessionId
      );
    }

    sessionId = existingSessionId;

    // console.log(
    //   'INDQ chatbot session:',
    //   sessionId
    // );
  });

  async function scrollToBottom() {
    await tick();

    if (chatContainer) {
      chatContainer.scrollTop =
        chatContainer.scrollHeight;
    }
  }

  function toggleChat() {
    isOpen = !isOpen;

    if (isOpen && messages.length === 0) {
      messages = [
        {
          role: 'assistant',
          content:
            'Hello! I can help you explore INDQ Studio’s services, capabilities, locations, and project enquiry process.'
        }
      ];
    }

    if (isOpen) {
      scrollToBottom();
    }
  }

  async function sendMessage(
    text = inputMessage
  ) {
    const content = text.trim();

    if (!content || isLoading) {
      return;
    }

    /*
     * Save previous conversation.
     *
     * We are sending it to n8n already.
     * Later we can use this history for
     * conversational follow-up questions.
     */
    const history = messages.map(
      ({ role, content }) => ({
        role,
        content
      })
    );

    // Immediately show user message in UI
    messages = [
      ...messages,
      {
        role: 'user',
        content
      }
    ];

    inputMessage = '';
    isLoading = true;

    await scrollToBottom();

    try {
      const response = await fetch(
        N8N_WEBHOOK_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },

          body: JSON.stringify({
            message: content,

            sessionId:
              sessionId || 'anonymous',

            name: '',
            email: '',
            phone: '',

            history
          })
        }
      );

      /*
       * Read the app's JSON response. Deployed hosts can
       * return HTML error pages during outages, so this
       * must not call response.json() blindly.
       */
      const data =
        await readChatResponse(response);

// console.log(
//   'INDQ chatbot response:',
//   data
// );

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            'The assistant is temporarily unavailable. Please try again.'
        );
      }
      /*
       * IMPORTANT
       *
       * Your n8n Respond to Webhook node
       * returns:
       *
       * {
       *   success: true,
       *   answerFound: true,
       *   category: "Services",
       *   reply: "...",
       *   sessionId: "..."
       * }
       *
       * Therefore we use:
       *
       * data.reply
       *
       * instead of the old:
       *
       * data.answer
       */
      const assistantReply =
        data.answer ||
        data.reply ||
        data.output ||
        data.response ||
        data.message ||
        data.text ||
        'I could not find verified information for that question.';

      messages = [
        ...messages,
        {
          role: 'assistant',
          content: assistantReply,
          sources:
            Array.isArray(data.sources)
              ? data.sources
              : []
        }
      ];

      logTurn(content, assistantReply, data.model, data.status);

    } catch (error) {
      console.error(
        'INDQ chatbot request failed:',
        error
      );

      const errorReply =
        error instanceof Error
          ? error.message
          : 'The assistant is temporarily unavailable. Please try again.';

      messages = [
        ...messages,
        {
          role: 'assistant',
          content: errorReply
        }
      ];

      logTurn(content, errorReply, '', 'error');
    } finally {
      isLoading = false;

      await scrollToBottom();
    }
  }

  /*
   * Fire-and-forget: record the Q&A to the server log (Google Sheet).
   * Runs after the answer is already on screen, so it never delays the reply.
   */
  function logTurn(
    question: string,
    answer: string,
    model?: string,
    status?: string
  ) {
    fetch('/api/chat-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId || 'anonymous',
        question,
        answer,
        model: model || '',
        status: status || ''
      })
    }).catch(() => {
      /* logging is best-effort; ignore failures */
    });
  }

  function handleKeydown(
    event: KeyboardEvent
  ) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  async function readChatResponse(
    response: Response
  ): Promise<ChatResponse> {
    const responseText =
      await response.text();

    if (!responseText) {
      return {};
    }

    try {
      return JSON.parse(responseText);
    } catch {
      console.error(
        'INDQ chatbot returned non-JSON:',
        response.status,
        responseText.slice(0, 500)
      );

      return {
        success: false,
        error:
          'The assistant is temporarily unavailable. Please try again.'
      };
    }
  }

  function getMessageParts(
    content: string
  ): MessagePart[] {
    const parts: MessagePart[] = [];
    const linkPattern =
      /\[([^\]]+)\]\((https?:\/\/[^\s<>"')]+)\)|(https?:\/\/[^\s<>"'\]]+)/gi;
    let lastIndex = 0;

    for (const match of content.matchAll(
      linkPattern
    )) {
      const matchIndex = match.index ?? 0;
      const markdownLabel = match[1];
      let url = match[2] || match[3];
      let trailingText = '';

      while (/[.,!?;:)]$/.test(url)) {
        trailingText =
          url.slice(-1) + trailingText;
        url = url.slice(0, -1);
      }

      if (matchIndex > lastIndex) {
        parts.push({
          type: 'text',
          value: content.slice(
            lastIndex,
            matchIndex
          )
        });
      }

      if (url) {
        parts.push({
          type: 'link',
          value: url,
          label: getShortLinkLabel(
            url,
            markdownLabel
          )
        });
      }

      if (trailingText) {
        parts.push({
          type: 'text',
          value: trailingText
        });
      }

      lastIndex =
        matchIndex + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        value: content.slice(lastIndex)
      });
    }

    return parts;
  }

  function getShortLinkLabel(
    url: string,
    markdownLabel = ''
  ) {
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname
        .replace(/^www\./, '')
        .toLowerCase();
      const displayPath = parsedUrl.pathname
        .split('/')
        .filter(Boolean)
        .join('/');
      const normalizedPath = parsedUrl.pathname
        .split('/')
        .filter(Boolean)
        .join('/')
        .toLowerCase();

      if (
        host === 'indq.in' &&
        normalizedPath === 'crs'
      ) {
        return 'INDQ CRS';
      }

      if (
        markdownLabel &&
        !/^https?:\/\//i.test(markdownLabel)
      ) {
        return markdownLabel;
      }

      return displayPath
        ? `${host}/${displayPath}`
        : host;
    } catch {
      return url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '');
    }
  }
</script>

<div class="chat-shell">
  {#if isOpen}
    <section
      class="chat-window"
      aria-label="INDQ Studio assistant"
    >
      <header class="chat-header">
        <div class="bot-avatar">
          <img src={ai} alt="" />
        </div>

        <div class="header-copy">
          <h2>INDQ Studio Assistant</h2>

          <p>
            <span class="status-dot"></span>
            Online · Answers from INDQ sources
          </p>
        </div>

        <button
          class="icon-button"
          onclick={toggleChat}
          aria-label="Close chat"
        >
          ×
        </button>
      </header>

      <div
        class="messages"
        bind:this={chatContainer}
        aria-live="polite"
      >
        {#each messages as message}
          <div
            class:user-row={message.role === 'user'}
            class="message-row"
          >
            <div
              class:assistant-bubble={message.role === 'assistant'}
              class:user-bubble={message.role === 'user'}
              class="bubble"
            >
              <p>
                {#each getMessageParts(message.content) as part}
                  {#if part.type === 'link'}
                    <a
                      class="message-link"
                      href={part.value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {part.label ?? part.value}
                    </a>
                  {:else}
                    {part.value}
                  {/if}
                {/each}
              </p>

              {#if message.sources?.length}
                <div class="sources">
                  <span>Sources</span>

                  {#each message.sources as source}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.title}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}

        {#if messages.length === 1}
          <div class="suggestions">
            {#each suggestions as suggestion}
              <button
                onclick={() =>
                  sendMessage(suggestion)}
              >
                {suggestion}
              </button>
            {/each}
          </div>
        {/if}

        {#if isLoading}
          <div class="message-row">
            <div
              class="bubble assistant-bubble typing"
              aria-label="Assistant is typing"
            >
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>
        {/if}
      </div>

      <form
        class="composer"
        onsubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <textarea
          bind:value={inputMessage}
          onkeydown={handleKeydown}
          maxlength="800"
          rows="1"
          placeholder="Ask about INDQ…"
          aria-label="Message"
          disabled={isLoading}
        ></textarea>

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          aria-label="Send message"
        >
          ➤
        </button>
      </form>

      <p class="disclaimer">
        AI responses may be inaccurate.
        Verify important details with INDQ.
      </p>
    </section>
  {:else}
    <button
      class="launcher"
      onclick={toggleChat}
      aria-label="Open INDQ Studio assistant"
    >
      <img src={ai} alt="" />
      <span>Ask INDQ</span>
    </button>
  {/if}
</div>

<style>
  .chat-shell {
    position: fixed;
    right: clamp(1rem, 3vw, 3rem);
    bottom: clamp(1rem, 3vw, 2.5rem);
    z-index: 1000;
    font-family: 'Gill Sans', sans-serif;
  }

  .launcher {
    border: 0;
    border-radius: 999px;
    padding: .65rem 1rem .65rem .7rem;
    display: flex;
    align-items: center;
    gap: .55rem;
    background: linear-gradient(
      135deg,
      #b9dff1,
      #f3c9bd 55%,
      #f7e6a7
    );
    color: #252525;
    box-shadow: 0 12px 34px #25364a3d;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .launcher:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 38px #25364a4a;
  }

  .launcher img {
    width: 2.25rem;
    height: 2.25rem;
    object-fit: contain;
  }

  .chat-window {
    width: min(24rem, calc(100vw - 2rem));
    height: min(38rem, calc(100vh - 2rem));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #dce2e6;
    border-radius: 1.25rem;
    background: #fff;
    box-shadow: 0 22px 65px #18283c3b;
  }

  .chat-header {
    display: flex;
    align-items: center;
    gap: .7rem;
    padding: .9rem 1rem;
    background: linear-gradient(
      135deg,
      #e5f5fc,
      #f9e1db 58%,
      #fff3c8
    );
    border-bottom: 1px solid #e8e8e8;
  }

  .bot-avatar {
    width: 2.65rem;
    height: 2.65rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #ffffff9e;
  }

  .bot-avatar img {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
  }

  .header-copy {
    min-width: 0;
    flex: 1;
  }

  .header-copy h2 {
    margin: 0;
    color: #222;
    font-size: 1rem;
    font-weight: 600;
  }

  .header-copy p {
    margin: .12rem 0 0;
    color: #61686c;
    font-size: .72rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-dot {
    display: inline-block;
    width: .45rem;
    height: .45rem;
    margin-right: .2rem;
    border-radius: 50%;
    background: #3ba76d;
  }

  .icon-button {
    border: 0;
    background: transparent;
    color: #3d4549;
    font-size: 1.65rem;
    line-height: 1;
    cursor: pointer;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background: #f8fafb;
  }

  .message-row {
    display: flex;
    justify-content: flex-start;
    margin-bottom: .75rem;
  }

  .user-row {
    justify-content: flex-end;
  }

  .bubble {
    max-width: 84%;
    padding: .7rem .85rem;
    border-radius: 1rem;
    color: #30363a;
    font-size: .88rem;
    line-height: 1.4;
  }

  .bubble p {
    margin: 0;
    white-space: pre-wrap;
  }

  .message-link {
    color: #17698b;
    font-weight: 600;
    overflow-wrap: anywhere;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .message-link:hover {
    color: #0f516d;
  }

  .assistant-bubble {
    background: #fff;
    border: 1px solid #e1e6e9;
    border-bottom-left-radius: .3rem;
  }

  .user-bubble {
    background: #dceff8;
    border-bottom-right-radius: .3rem;
  }

  .sources {
    display: flex;
    flex-wrap: wrap;
    gap: .35rem;
    margin-top: .65rem;
    padding-top: .55rem;
    border-top: 1px solid #e8ecee;
  }

  .sources span {
    width: 100%;
    color: #71777a;
    font-size: .68rem;
    text-transform: uppercase;
    letter-spacing: .06em;
  }

  .sources a {
    color: #17698b;
    font-size: .72rem;
    text-decoration: underline;
  }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: .45rem;
    margin: .25rem 0 1rem;
  }

  .suggestions button {
    border: 1px solid #bcdbe8;
    border-radius: 999px;
    padding: .42rem .65rem;
    background: #fff;
    color: #315f72;
    font: inherit;
    font-size: .75rem;
    cursor: pointer;
  }

  .typing {
    display: flex;
    gap: .25rem;
    padding: .85rem 1rem;
  }

  .typing i {
    width: .38rem;
    height: .38rem;
    border-radius: 50%;
    background: #8a979d;
    animation: pulse 1s infinite alternate;
  }

  .typing i:nth-child(2) {
    animation-delay: .2s;
  }

  .typing i:nth-child(3) {
    animation-delay: .4s;
  }

  .composer {
    display: flex;
    gap: .55rem;
    align-items: flex-end;
    padding: .75rem .8rem .45rem;
    border-top: 1px solid #e3e7e9;
    background: #fff;
  }

  .composer textarea {
    flex: 1;
    min-height: 2.5rem;
    max-height: 6rem;
    resize: none;
    border: 1px solid #ccd5d9;
    border-radius: 1.2rem;
    padding: .62rem .8rem;
    outline: none;
    font: inherit;
    font-size: .88rem;
  }

  .composer textarea:focus {
    border-color: #74aec5;
    box-shadow: 0 0 0 3px #b9dff155;
  }

  .composer button {
    width: 2.55rem;
    height: 2.55rem;
    border: 0;
    border-radius: 50%;
    background: #236f8e;
    color: #fff;
    cursor: pointer;
  }

  .composer button:disabled {
    opacity: .4;
    cursor: not-allowed;
  }

  .disclaimer {
    margin: 0;
    padding: 0 .8rem .55rem;
    background: #fff;
    color: #858b8e;
    font-size: .64rem;
    text-align: center;
  }

  @keyframes pulse {
    from {
      opacity: .35;
      transform: translateY(1px);
    }

    to {
      opacity: 1;
      transform: translateY(-2px);
    }
  }

  @media (max-width: 520px) {
    .chat-shell {
      right: 1rem;
      bottom: 1rem;
    }

    .chat-window {
      height: calc(100dvh - 2rem);
    }
  }
</style>
