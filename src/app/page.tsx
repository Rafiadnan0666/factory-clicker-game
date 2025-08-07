"use client"
import React, { useState, useEffect, useCallback } from 'react'

const Factory404 = () => {
  // Game state
  const [clicks, setClicks] = useState(0)
  const [items, setItems] = useState<string[]>([])
  const [credits, setCredits] = useState(0)
  const [autoClickers, setAutoClickers] = useState(0)
  const [upgrades, setUpgrades] = useState({
    overclock: 0,
    bugExploiter: 0,
    systemPatch: 0,
    quantumCore: 0,
    neuralNetwork: 0,
    singularityDrive: 0
  })
  const [messages, setMessages] = useState<string[]>([
    "> [SYSTEM BOOT] Factory 404 initializing...",
    "> [MEMTEST] 640K RAM OK",
    "> [DISK] Floppy drive seek... done",
    "> [VIDEO] CGA mode activated",
    "> [STATUS] Awaiting user input...",
    "> [PROMPT] _"
  ])
  const [corruptionLevel, setCorruptionLevel] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const [factoryHealth, setFactoryHealth] = useState(100)
  const [scanLinePos, setScanLinePos] = useState(0)
  const [activeAnimation, setActiveAnimation] = useState(0)
  const [showLore, setShowLore] = useState(true)
  const [showVictory, setShowVictory] = useState(false)
  const [galaxyRotation, setGalaxyRotation] = useState(0)
  const [graphData, setGraphData] = useState<number[]>([])
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number}>>([])

  // Check if first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('factory404_visited')
    if (!hasVisited) {
      setShowLore(true)
      localStorage.setItem('factory404_visited', 'true')
    } else {
      setShowLore(false)
    }
  }, [])

  // Check for victory condition
  useEffect(() => {
    if (corruptionLevel >= 3 && upgrades.singularityDrive > 0) {
      setShowVictory(true)
    }
  }, [corruptionLevel, upgrades.singularityDrive])

  // Galaxy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGalaxyRotation(prev => (prev + 1) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Graph data updates
  useEffect(() => {
    if (clicks % 5 === 0) {
      setGraphData(prev => [...prev.slice(-19), clicks].filter(Boolean))
    }
  }, [clicks])

  // Particle effects
  useEffect(() => {
    if (isGlitching || corruptionLevel > 0) {
      const newParticles = Array.from({length: 10 + (corruptionLevel * 5)}, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        life: 50 + Math.random() * 100
      }))
      setParticles(prev => [...prev, ...newParticles].slice(0, 100))
    }

    const updateParticles = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1
        })).filter(p => p.life > 0)
      )
    }, 50)

    return () => clearInterval(updateParticles)
  }, [isGlitching, corruptionLevel])

  // ASCII items with more variety
  const itemTemplates = [
    "╔═╗ WIRE.TUBE",
    "╠═╣ ERROR.LOG",
    "╚═╝ URANIUM.BOLT",
    "╔╦╗ DATA.CORE",
    "╠╬╣ CARBON.SHAFT",
    "╚╩╝ CRYPTO.CHIP",
    "║☢║ MEMORY.CELL",
    "╞═╡ UNKNOWN.PART",
    "╟─╢ OVERFLOW.BUF",
    "╞╪╡ NANITE.GEL",
    "╓─╖ BIO.CIRCUIT",
    "║▒║ PLASMA.TUBE",
    "╙─╜ FUSION.CELL",
    "╒═╕ QUANTUM.CHIP",
    "╞╪╡ NEURAL.LINK"
  ]

  // Corrupted items (unlocked later)
  const corruptedTemplates = [
    "╔╗╔ CORRUPTED.OBJ",
    "╚╝╚ GLITCH.UNIT",
    "╔╝╚ ERROR.ENTITY",
    "╚╗╔ VOID.MATTER",
    "║║║ MALFORMED.PART",
    "╞╡╞ ENTROPY.CORE",
    "╟╢╟ CHAOS.MATRIX",
    "╠╣╠ NULL.OBJECT",
    "╡╞╡ PARADOX.CIRCUIT",
    "╢╟╢ ANTIMATTER.CELL"
  ]

  // Generate random item with more visual variety
  const generateItem = useCallback((isCorrupted = false) => {
    const templates = isCorrupted && corruptionLevel > 0 
      ? [...itemTemplates, ...corruptedTemplates] 
      : itemTemplates
    
    const item = templates[Math.floor(Math.random() * templates.length)]
    const variants = [
      `[${item}]`,
      `{${item}}`,
      `(${item})`,
      `<${item}>`,
      `|${item}|`
    ]
    
    return variants[Math.floor(Math.random() * variants.length)]
  }, [corruptionLevel])

  // Add message to terminal with proper prompt
  const addMessage = useCallback((msg: string) => {
    setMessages(prev => {
      const newMsgs = [...prev]
      // Remove the last prompt if it exists
      if (newMsgs[newMsgs.length - 1].endsWith('_')) {
        newMsgs.pop()
      }
      newMsgs.push(msg)
      // Add new prompt
      newMsgs.push("> [PROMPT] _")
      // Keep only last 15 messages
      return newMsgs.slice(-15)
    })
  }, [])

  // Handle terminal input submission
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const command = terminalInput.trim().toLowerCase()
    setTerminalInput('')
    
    addMessage(`> ${command}`)
    
    switch(command) {
      case 'help':
        setShowHelp(true)
        break
      case 'clear':
        setMessages([
          "> [SYSTEM] Terminal cleared",
          "> [PROMPT] _"
        ])
        break
      case 'reboot':
        rebootFactory()
        break
      case 'status':
        addMessage(`> [STATUS] Clicks: ${clicks} | Items: ${items.length} | Credits: ${credits}`)
        addMessage(`> [UPGRADES] OC:${upgrades.overclock} BE:${upgrades.bugExploiter} SP:${upgrades.systemPatch} NN:${upgrades.neuralNetwork}`)
        addMessage(`> [AUTOMATION] ${autoClickers} units`)
        break
      case 'inventory':
        if (items.length > 0) {
          addMessage("> [INVENTORY]")
          // Show last 5 items
          items.slice(-5).reverse().forEach(item => {
            addMessage(`> ${item}`)
          })
        } else {
          addMessage("> [INVENTORY] Empty")
        }
        break
      case 'graph':
        addMessage("> [GRAPH] Showing production metrics")
        break
      default:
        addMessage("> [ERROR] Unknown command. Type 'help' for options")
    }
  }

  // Handle click with more effects
  const handleClick = useCallback(() => {
    const baseProduction = 1 + (upgrades.overclock * 2) + (upgrades.neuralNetwork * 5)
    const newClicks = clicks + baseProduction
    setClicks(newClicks)
    
    // Generate items
    const newItems = [...items]
    const itemsToAdd = 1 + (upgrades.bugExploiter * 2) + (upgrades.singularityDrive * 10)
    const isCorrupted = corruptionLevel > 0 && Math.random() > 0.7
    
    for (let i = 0; i < itemsToAdd; i++) {
      newItems.push(generateItem(isCorrupted))
    }
    
    setItems(newItems)
    
    // Add credits with diminishing returns at higher corruption
    const creditMultiplier = 1 - (corruptionLevel * 0.1) + (upgrades.singularityDrive * 0.5)
    const newCredits = credits + Math.max(1, Math.floor((1 + Math.random() * 3) * creditMultiplier))
    setCredits(newCredits)
    
    // Add messages about production
    newItems.slice(-itemsToAdd).forEach(item => {
      addMessage(`> [PRODUCTION] Assembled: ${item}`)
    })
    
    // Random events based on corruption level
    if (Math.random() > 0.95 - (corruptionLevel * 0.05)) {
      const normalEvents = [
        "> [WARNING] Memory leak detected",
        "> [NOTICE] Defragmenting drive...",
        "> [ALERT] Cooling fans at 75%",
        "> [STATUS] Production nominal",
        "> [ERROR] Divide by zero exception",
        "> [PATCH] Applied hotfix"
      ]
      
      const corruptedEvents = [
        "> [WARNING] Reality instability detected",
        "> [ALERT] Quantum decoherence imminent",
        "> [ERROR] Time paradox prevented",
        "> [NOTICE] Chronal particles detected",
        "> [CRITICAL] Dimensional breach contained",
        "> [WARNING] Entropy levels rising"
      ]
      
      const events = corruptionLevel > 0 
        ? [...normalEvents, ...corruptedEvents]
        : normalEvents
      
      addMessage(events[Math.floor(Math.random() * events.length)])
    }
    
    // Check for corruption unlock
    if (newClicks >= 100 && corruptionLevel === 0) {
      addMessage("> [WARNING] System instability detected")
      addMessage("> [ADVICE] Type 'reboot' to enable advanced features")
    }
    
    // Random glitch effect
    if (Math.random() > 0.9 - (corruptionLevel * 0.1)) {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 300)
    }
    
    // Degrade factory health with usage
    if (Math.random() > 0.8) {
      setFactoryHealth(prev => Math.max(0, prev - 1))
    }
  }, [clicks, items, upgrades, corruptionLevel, credits, addMessage, generateItem])

  // Auto-clicker effect with health check
useEffect(() => {
  if (autoClickers > 0) {
    const efficiency = factoryHealth / 100;
    const interval = setInterval(() => {
      if (Math.random() < efficiency) {
        handleClick(); // Only work if factory is healthy
      }
    }, 1000 / (autoClickers * (1 + (upgrades.quantumCore * 0.5) + (upgrades.neuralNetwork * 2)))); // ← This was missing a closing parenthesis

    return () => clearInterval(interval);
  }
}, [autoClickers, handleClick, factoryHealth, upgrades.quantumCore, upgrades.neuralNetwork]);


  // Repair factory over time
  useEffect(() => {
    const repairInterval = setInterval(() => {
      if (factoryHealth < 100) {
        setFactoryHealth(prev => Math.min(100, prev + 0.1 + (upgrades.systemPatch * 0.2)))
      }
    }, 1000)
    
    return () => clearInterval(repairInterval)
  }, [factoryHealth, upgrades.systemPatch])

  // Scan line animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanLinePos(prev => (prev + 1) % 20)
    }, 100)
    return () => clearInterval(scanInterval)
  }, [])

  // Active animation cycling
  useEffect(() => {
    const animInterval = setInterval(() => {
      setActiveAnimation(prev => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(animInterval)
  }, [])

  // Buy upgrade with more feedback
  const buyUpgrade = (type: string) => {
    const cost = getUpgradeCost(type)
    if (credits >= cost) {
      setCredits(credits - cost)
      
      switch(type) {
        case 'autoClicker':
          setAutoClickers(autoClickers + 1)
          addMessage(`> [INSTALL] Added assembly drone`)
          break
        case 'overclock':
          setUpgrades({...upgrades, overclock: upgrades.overclock + 1})
          addMessage(`> [UPGRADE] CPU overclocked to ${upgrades.overclock + 1}x`)
          break
        case 'bugExploiter':
          setUpgrades({...upgrades, bugExploiter: upgrades.bugExploiter + 1})
          addMessage(`> [UPGRADE] Bug exploitation v${upgrades.bugExploiter + 1}.0`)
          break
        case 'systemPatch':
          setUpgrades({...upgrades, systemPatch: upgrades.systemPatch + 1})
          addMessage(`> [PATCH] System stability +20%`)
          break
        case 'quantumCore':
          setUpgrades({...upgrades, quantumCore: upgrades.quantumCore + 1})
          addMessage(`> [UPGRADE] Quantum core synchronized`)
          break
        case 'neuralNetwork':
          setUpgrades({...upgrades, neuralNetwork: upgrades.neuralNetwork + 1})
          addMessage(`> [UPGRADE] Neural network layer added`)
          break
        case 'singularityDrive':
          setUpgrades({...upgrades, singularityDrive: upgrades.singularityDrive + 1})
          addMessage(`> [UPGRADE] Singularity drive engaged`)
          break
      }
    } else {
      addMessage("> [ERROR] Insufficient credits")
    }
  }

  const getUpgradeCost = (type: string) => {
    switch(type) {
      case 'autoClicker': 
        return 10 + (autoClickers * 5)
      case 'overclock':
        return 15 + (upgrades.overclock * 10)
      case 'bugExploiter':
        return 20 + (upgrades.bugExploiter * 15)
      case 'systemPatch':
        return 30 + (upgrades.systemPatch * 20)
      case 'quantumCore':
        return 50 + (upgrades.quantumCore * 30)
      case 'neuralNetwork':
        return 75 + (upgrades.neuralNetwork * 50)
      case 'singularityDrive':
        return 100 + (upgrades.singularityDrive * 75)
      default:
        return 0
    }
  }

  // Reboot for corruption mode with more effects
  const rebootFactory = useCallback(() => {
    if (clicks >= 100 && corruptionLevel < 3) {
      setCorruptionLevel(corruptionLevel + 1)
      setClicks(0)
      setItems([])
      setMessages([
        "> [SYSTEM REBOOT] Initializing...",
        "> [WARNING] Bypassing safety protocols",
        "> [ALERT] Quantum fluctuations detected",
        `> [STATUS] Corruption level ${corruptionLevel + 1} enabled`,
        "> [PROMPT] _"
      ])
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 1000)
    }
  }, [clicks, corruptionLevel])

  // ASCII art for different factory states
  const getFactoryArt = () => {
    const animations = [
      ["   _____________________", "  /                    /|", " /                    / |", "/____________________/  |", "|                    |  |", "|     FACTORY 404    |  |", "|                    |  |", "|____________________| /", "                     |/"],
      ["   _____________________", "  /[]================[]/|", " /                    / |", "/____________________/  |", "|                    |  |", "|     FACTORY 404    |  |", "|                    |  |", "|____________________| /", "                     |/"],
      ["   _____________________", "  /░░░░░░░░░░░░░░░░░░░░/|", " /                    / |", "/____________________/  |", "|                    |  |", "|     FACTORY 404    |  |", "|                    |  |", "|____________________| /", "                     |/"],
      ["   _____________________", "  /||||||||||||||||||||/|", " /                    / |", "/____________________/  |", "|                    |  |", "|     FACTORY 404    |  |", "|                    |  |", "|____________________| /", "                     |/"]
    ]

    const baseArt = [...animations[activeAnimation]]
    
    if (corruptionLevel > 0) {
      baseArt[5] = "|  !FACTORY 404!   |  |"
      baseArt.splice(4, 0, "|  ╔═══╗ ╔═══╗  |  |")
      baseArt.splice(5, 0, "|  ║☠ ║ ║ ☠║  |  |")
      baseArt.splice(6, 0, "|  ╚═╦╝ ╚╦═╝  |  |")
    }
    
    return baseArt
  }

  // Generate animated galaxy ASCII
  const getGalaxyArt = () => {
    const frames = [
      `
        . * . . * .
      .   .  *  .   .
    *  .   . . .   .  *
      .   *  . .  *   .
        . . * . * . .
      `,
      `
        . . * * . .
      .  *  . .  *  .
    . .   . * * .   . .
      .  *  . .  *  .
        . . * * . .
      `,
      `
        * . . . . *
      .   *  .  *   .
    . .   *  *   . . .
      .   *  .  *   .
        * . . . . *
      `
    ]
    
    return frames[Math.floor(galaxyRotation / 30) % frames.length]
  }

  // Generate exponential graph ASCII
  const getGraphArt = () => {
    if (graphData.length < 2) return "> [GRAPH] Collecting data..."
    
    const maxValue = Math.max(...graphData) || 1
    const height = 8
    const width = 20
    
    const graphLines = []
    
    for (let y = height; y >= 0; y--) {
      let line = "|"
      const threshold = (y / height) * maxValue
      
      for (let x = 0; x < Math.min(width, graphData.length); x++) {
        const value = graphData[graphData.length - 1 - x] || 0
        line += value >= threshold ? "█" : " "
      }
      
      graphLines.push(line)
    }
    
    graphLines.push("+" + "-".repeat(Math.min(width, graphData.length)) + ">")
    
    return graphLines.join('\n')
  }

  // Scan line effect component
  const ScanLine = () => (
    <div 
      className="absolute left-0 right-0 h-px bg-green-400 opacity-20"
      style={{ top: `${scanLinePos * 5}%` }}
    />
  )

  // Particle effect component
  const ParticleEffects = () => (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-green-400 rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.life / 100,
            transform: `scale(${p.life / 50})`
          }}
        />
      ))}
    </div>
  )

  return (
    <div className={`min-h-screen bg-black text-green-400 font-mono p-2 md:p-4 overflow-hidden relative ${isGlitching ? 'glitch-effect' : ''}`}>
      {/* Scan line effect */}
      <ScanLine />
      
      {/* Particle effects */}
      <ParticleEffects />
      
      {/* CRT screen effect */}
      <div className="crt-overlay"></div>
      
      {/* Main terminal container */}
      <div className="max-w-6xl mx-auto border-2 border-green-800 bg-black bg-opacity-90 p-2 md:p-4 relative">
        {/* Header with ASCII art */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <pre className="hidden md:block text-xs md:text-sm">
            {getFactoryArt().join('\n')}
          </pre>
          
          <div className="flex-1 border border-green-800 p-2 relative">
            {/* Flashing cursor animation */}
            <div className="absolute right-4 top-4 w-2 h-4 bg-green-400 animate-pulse"></div>
            
            <pre className="text-xs md:text-sm">
              {`+=========================================+
|  FACTORY 404 TERMINAL v1.${corruptionLevel}.${upgrades.systemPatch}     |
+=========================================+
| CLICKS: ${clicks.toString().padStart(8)} | CREDITS: ${credits.toString().padStart(6)} |
| ITEMS: ${items.length.toString().padStart(9)} | HEALTH: [${'█'.repeat(Math.floor(factoryHealth/10))}${'░'.repeat(10 - Math.floor(factoryHealth/10))}] |
| CORRUPTION: ${corruptionLevel}/3 | AUTOMATION: ${autoClickers} |
+=========================================+`}
            </pre>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Terminal output */}
          <div className="lg:col-span-2 border border-green-800 p-2 h-64 overflow-y-auto relative">
            {/* Animated cursor at bottom */}
            <div className="absolute bottom-4 left-4 w-2 h-4 bg-green-400 animate-pulse"></div>
            
            <div className="text-xs md:text-sm font-mono">
              {messages.map((msg, i) => (
                <div key={i} className={msg.includes('ERROR') ? 'text-red-400' : 
                                       msg.includes('WARNING') ? 'text-yellow-400' : 
                                       msg.includes('ALERT') ? 'text-red-500' : 
                                       'text-green-400'}>
                  {msg}
                </div>
              ))}
            </div>
            
            {/* Terminal input */}
            <form onSubmit={handleTerminalSubmit} className="mt-2 flex items-center">
              <span className="text-green-400 mr-2">&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-black text-green-400 border-b border-green-800 focus:outline-none caret-green-400"
                placeholder="Type commands here..."
              />
              <button 
                type="submit" 
                className="ml-2 px-2 border border-green-400 hover:bg-green-400 hover:text-black"
              >
                [ENTER]
              </button>
            </form>
          </div>
          
          {/* Control panel */}
          <div className="border border-green-800 p-2">
            <div className="flex flex-col h-full">
              {/* Main button */}
              <button 
                onClick={handleClick}
                className="border-2 border-green-400 px-4 py-3 mb-4 text-lg hover:bg-green-400 hover:text-black transition flex items-center justify-center relative overflow-hidden"
                disabled={factoryHealth <= 0}
              >
                {/* Button animation */}
                <div className="absolute inset-0 bg-green-400 opacity-10 hover:opacity-20 transition"></div>
                <span className="text-xs mr-2">[RUN]</span> 
                ASSEMBLE ITEM
                <span className="text-xs ml-2">{1 + (upgrades.overclock * 2) + (upgrades.neuralNetwork * 5)}x</span>
              </button>
              
              {/* Upgrades */}
              <div className="border-t border-green-800 pt-2 flex-1 overflow-y-auto">
                <h3 className="text-center mb-2">[ UPGRADES ]</h3>
                
                <div className="space-y-2 text-xs">
                  <button 
                    onClick={() => buyUpgrade('autoClicker')}
                    className={`w-full border ${credits >= getUpgradeCost('autoClicker') ? 'border-green-400 hover:bg-green-400' : 'border-gray-600'} p-1 hover:text-black flex justify-between relative`}
                    disabled={credits < getUpgradeCost('autoClicker')}
                  >
                    <span>ASSEMBLY DRONE</span>
                    <span>{'▮'.repeat(10 + (autoClickers * 5))}</span>
                    {credits >= getUpgradeCost('autoClicker') && (
                      <span className="absolute left-0 top-0 h-full bg-green-400 opacity-10 hover:opacity-20"></span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => buyUpgrade('overclock')}
                    className={`w-full border ${credits >= getUpgradeCost('overclock') ? 'border-green-400 hover:bg-green-400' : 'border-gray-600'} p-1 hover:text-black flex justify-between relative`}
                    disabled={credits < getUpgradeCost('overclock')}
                  >
                    <span>OVERCLOCK CPU</span>
                    <span>{'▮'.repeat(15 + (upgrades.overclock * 10))}</span>
                    {credits >= getUpgradeCost('overclock') && (
                      <span className="absolute left-0 top-0 h-full bg-green-400 opacity-10 hover:opacity-20"></span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => buyUpgrade('bugExploiter')}
                    className={`w-full border ${credits >= getUpgradeCost('bugExploiter') ? 'border-green-400 hover:bg-green-400' : 'border-gray-600'} p-1 hover:text-black flex justify-between relative`}
                    disabled={credits < getUpgradeCost('bugExploiter')}
                  >
                    <span>BUG EXPLOITER</span>
                    <span>{'▮'.repeat(20 + (upgrades.bugExploiter * 15))}</span>
                    {credits >= getUpgradeCost('bugExploiter') && (
                      <span className="absolute left-0 top-0 h-full bg-green-400 opacity-10 hover:opacity-20"></span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => buyUpgrade('systemPatch')}
                    className={`w-full border ${credits >= getUpgradeCost('systemPatch') ? 'border-green-400 hover:bg-green-400' : 'border-gray-600'} p-1 hover:text-black flex justify-between relative`}
                    disabled={credits < getUpgradeCost('systemPatch')}
                  >
                    <span>SYSTEM PATCH</span>
                    <span>{'▮'.repeat(30 + (upgrades.systemPatch * 20))}</span>
                    {credits >= getUpgradeCost('systemPatch') && (
                      <span className="absolute left-0 top-0 h-full bg-green-400 opacity-10 hover:opacity-20"></span>
                    )}
                  </button>
                  
                  {corruptionLevel > 0 && (
                    <button 
                      onClick={() => buyUpgrade('quantumCore')}
                      className={`w-full border ${credits >= getUpgradeCost('quantumCore') ? 'border-purple-400 hover:bg-purple-400' : 'border-gray-600'} p-1 hover:text-black flex justify-between relative`}
                      disabled={credits < getUpgradeCost('quantumCore')}
                    >
                      <span>QUANTUM CORE</span>
                      <span>{'▮'.repeat(50 + (upgrades.quantumCore * 30))}</span>
                      {credits >= getUpgradeCost('quantumCore') && (
                        <span className="absolute left-0 top-0 h-full bg-purple-400 opacity-10 hover:opacity-20"></span>
                      )}
                    </button>
                  )}
                  
                  {corruptionLevel > 1 && (
                    <button 
                      onClick={() => buyUpgrade('neuralNetwork')}
                      className={`w-full border ${credits >= getUpgradeCost('neuralNetwork') ? 'border-blue-400 hover:bg-blue-400' : 'border-gray-600'} p-1 hover:text-black flex justify-between relative`}
                      disabled={credits < getUpgradeCost('neuralNetwork')}
                    >
                      <span>NEURAL NETWORK</span>
                      <span>{'▮'.repeat(75 + (upgrades.neuralNetwork * 50))}</span>
                      {credits >= getUpgradeCost('neuralNetwork') && (
                        <span className="absolute left-0 top-0 h-full bg-blue-400 opacity-10 hover:opacity-20"></span>
                      )}
                    </button>
                  )}
                  
                  {corruptionLevel > 2 && (
                    <button 
                      onClick={() => buyUpgrade('singularityDrive')}
                      className={`w-full border ${credits >= getUpgradeCost('singularityDrive') ? 'border-red-400 hover:bg-red-400' : 'border-gray-600'} p-1 hover:text-black flex justify-between relative`}
                      disabled={credits < getUpgradeCost('singularityDrive')}
                    >
                      <span>SINGULARITY DRIVE</span>
                      <span>{'▮'.repeat(100 + (upgrades.singularityDrive * 75))}</span>
                      {credits >= getUpgradeCost('singularityDrive') && (
                        <span className="absolute left-0 top-0 h-full bg-red-400 opacity-10 hover:opacity-20"></span>
                      )}
                    </button>
                  )}
                </div>
                
                {clicks >= 100 && corruptionLevel < 3 && (
                  <button 
                    onClick={rebootFactory}
                    className="w-full border border-red-400 text-red-400 p-1 mt-4 text-xs hover:bg-red-400 hover:text-black relative overflow-hidden"
                  >
                    <span className="relative z-10">[ REBOOT FOR CORRUPTION MODE ]</span>
                    <span className="absolute inset-0 bg-red-400 opacity-10 hover:opacity-20"></span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Inventory with ASCII styling */}
        <div className="mt-4 border border-green-800 p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm">[ ITEM INVENTORY ]</h3>
            <span className="text-xs">Capacity: {items.length}/1000</span>
          </div>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item, i) => (
                <span 
                  key={i} 
                  className={`text-xs border px-1 ${item.includes('CORRUPT') ? 'border-red-400 text-red-400' : 'border-green-400'}`}
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-xs">No items produced yet</span>
            )}
          </div>
        </div>
        
        {/* Production graph */}
        {graphData.length > 1 && (
          <div className="mt-4 border border-green-800 p-2">
            <h3 className="text-sm mb-2">[ PRODUCTION METRICS ]</h3>
            <pre className="text-xs">
              {getGraphArt()}
            </pre>
          </div>
        )}
        
        {/* Footer with credits */}
        <div className="mt-4 text-xs text-center text-green-600">
          <p>CREATED BY RAFI ADNAN</p>
          <a 
            href="https://rafiadnan.my.id/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-green-400 underline"
          >
            https://rafiadnan.my.id/
          </a>
        </div>
        
        {/* Help modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-10">
            <div className="bg-black border-2 border-green-400 p-4 max-w-2xl relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg">[ FACTORY 404 HELP ]</h3>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="border border-green-400 px-2 hover:bg-green-400 hover:text-black"
                >
                  X
                </button>
              </div>
              
              <div className="text-sm space-y-2">
                <p><strong>CLICK BUTTON:</strong> Assemble items and earn credits</p>
                <p><strong>UPGRADES:</strong> Improve your factorys capabilities</p>
                <p><strong>TERMINAL COMMANDS:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>help</strong> - Show this help</li>
                  <li><strong>status</strong> - Show factory status</li>
                  <li><strong>inventory</strong> - Show recent items</li>
                  <li><strong>clear</strong> - Clear terminal</li>
                  <li><strong>reboot</strong> - Enable corruption mode (after 100 clicks)</li>
                  <li><strong>graph</strong> - Show production metrics</li>
                </ul>
                <p className="mt-2 text-yellow-400">WARNING: Corruption mode increases rewards but adds instability!</p>
              </div>
              
              {/* Modal scan line */}
              <div className="absolute left-0 right-0 h-px bg-green-400 opacity-20 animate-scan"></div>
            </div>
          </div>
        )}
        
        {/* Lore modal */}
        {showLore && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-20">
            <div className="bg-black border-2 border-green-400 p-4 max-w-2xl relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg">[ FACTORY 404 - SYSTEM BOOT ]</h3>
                <button 
                  onClick={() => setShowLore(false)}
                  className="border border-green-400 px-2 hover:bg-green-400 hover:text-black"
                >
                  CONTINUE
                </button>
              </div>
              
              <div className="text-sm space-y-4">
                <p>YEAR 2042 - QUANTUM COMPUTING ERA</p>
                <p>You have been assigned to manage FACTORY 404, an experimental quantum manufacturing facility.</p>
                <p>Your mission: Produce components for the first artificial superintelligence.</p>
                <p>But beware - the quantum cores are unstable. Pushing them too hard may unlock incredible power...</p>
                <p>...or tear reality apart.</p>
                <p className="text-yellow-400">[INSTRUCTIONS]</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Click the ASSEMBLE button to produce components</li>
                  <li>Earn credits to purchase upgrades</li>
                  <li>Type commands in the terminal for advanced control</li>
                  <li>Reboot when ready to unlock quantum corruption modes</li>
                </ul>
              </div>
              
              <div className="mt-4 text-xs text-green-600">
                <p>CREATED BY RAFI ADNAN</p>
                <p>https://rafiadnan.my.id/</p>
              </div>
              
              {/* Modal scan line */}
              <div className="absolute left-0 right-0 h-px bg-green-400 opacity-20 animate-scan"></div>
            </div>
          </div>
        )}
        
        {/* Victory modal */}
        {showVictory && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-20">
            <div className="bg-black border-2 border-purple-400 p-4 max-w-2xl relative text-center">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg">[ QUANTUM SINGULARITY ACHIEVED ]</h3>
                <button 
                  onClick={() => setShowVictory(false)}
                  className="border border-purple-400 px-2 hover:bg-purple-400 hover:text-black"
                >
                  CONTINUE
                </button>
              </div>
              
              <div className="text-sm space-y-4">
                <pre className="text-purple-400 text-xs whitespace-pre">
                  {getGalaxyArt()}
                </pre>
                
                <p>CONGRATULATIONS ENGINEER</p>
                <p>Youve pushed FACTORY 404 beyond its design limits.</p>
                <p>The quantum singularity drive is now self-sustaining.</p>
                <p>Your work here is complete.</p>
                <p className="text-purple-400">THANK YOU FOR PLAYING</p>
                
                <div className="mt-4 text-xs text-purple-600">
                  <p>CREATED BY RAFI ADNAN</p>
                  <a 
                    href="https://rafiadnan.my.id/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 underline"
                  >
                    https://rafiadnan.my.id/
                  </a>
                  <p className="mt-2">Check out my other projects:</p>
                  <div className="flex justify-center gap-2 mt-1">
                    <a href="#" className="hover:text-purple-400">GitHub</a>
                    <a href="#" className="hover:text-purple-400">Portfolio</a>
                    <a href="#" className="hover:text-purple-400">Blog</a>
                  </div>
                </div>
              </div>
              
              {/* Modal scan line */}
              <div className="absolute left-0 right-0 h-px bg-purple-400 opacity-20 animate-scan"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* CSS for effects */}
      <style jsx>{`
        .glitch-effect {
          animation: glitch 0.1s linear infinite;
        }
        
        @keyframes glitch {
          0% { 
            filter: hue-rotate(0deg) brightness(1.2);
            text-shadow: 0 0 5px #0f0;
          }
          25% { 
            filter: hue-rotate(90deg) brightness(1.3);
            text-shadow: 0 0 10px #0f0;
          }
          50% { 
            filter: hue-rotate(180deg) brightness(1.1);
            text-shadow: 0 0 5px #0f0;
          }
          75% { 
            filter: hue-rotate(270deg) brightness(1.4);
            text-shadow: 0 0 15px #0f0;
          }
          100% { 
            filter: hue-rotate(360deg) brightness(1.2);
            text-shadow: 0 0 5px #0f0;
          }
        }
        
        /* CRT screen effect */
        .crt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(rgba(0, 0, 0, 0.1) 50% 50% / 100% 2px no-repeat,
            linear-gradient(0deg, rgba(0, 0, 0, 0.2) 50%, transparent 50%);
          pointer-events: none;
          z-index: 10;
        }
        
        /* Scan line animation */
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #000;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #0f0;
        }
        
        /* Button animations */
        button:disabled {
          position: relative;
          overflow: hidden;
        }
        
        button:disabled::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,0,0,0.1) 10px,
            rgba(255,0,0,0.1) 20px
          );
        }
        
        /* Galaxy animation */
        @keyframes galaxy-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .galaxy {
          animation: galaxy-rotate 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Factory404