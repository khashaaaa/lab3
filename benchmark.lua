math.randomseed(os.time())

setup_done = false

local names = {"John", "Jane", "Robert", "Emma", "Michael", "Olivia", "William", "Sophia"}
local lastNames = {"Smith", "Johnson", "Brown", "Davis", "Wilson", "Miller", "Jones", "Garcia"}

local function randomEmail()
  local name = names[math.random(#names)]:lower()
  local lastName = lastNames[math.random(#lastNames)]:lower()
  return name .. "." .. lastName .. math.random(100, 999) .. "@example.com"
end

local function randomUser()
  local name = names[math.random(#names)] .. " " .. lastNames[math.random(#lastNames)]
  return '{"name":"' .. name .. '","email":"' .. randomEmail() .. '"}'
end

local user_ids = {}

request = function()
  local choice = math.random(10)
  
  if choice <= 5 then
    return wrk.format("GET", "/users")
  
  elseif choice <= 7 then
    wrk.headers["Content-Type"] = "application/json"
    return wrk.format("POST", "/users", nil, randomUser())
  
  elseif choice <= 9 and #user_ids > 0 then
    local id = user_ids[math.random(#user_ids)]
    return wrk.format("GET", "/users/" .. id)
  
  elseif choice == 10 and #user_ids > 0 then
    local id = user_ids[math.random(#user_ids)]
    wrk.headers["Content-Type"] = "application/json"
    return wrk.format("PUT", "/users/" .. id, nil, randomUser())
  
  else
    return wrk.format("GET", "/users")
  end
end

setup = function(thread)
  if not setup_done then
    print("Setting up benchmark data...")
    setup_done = true
    
    local host = "http://localhost:3000"
    local cmd = "curl -s -X POST " .. host .. "/users/benchmark/setup -H 'Content-Type: application/json' -d '{\"count\": 100}'"
    os.execute(cmd)
    
    local cmd = "curl -s " .. host .. "/users | grep -o '\"id\":\"[^\"]*\"' | sed 's/\"id\":\"\\(.*\\)\"/\\1/g' | head -5"
    local f = io.popen(cmd)
    local output = f:read("*all")
    f:close()
    
    for id in string.gmatch(output, "[^\n]+") do
      table.insert(user_ids, id)
      print("Added user ID: " .. id)
    end
    
    print("Setup completed with " .. #user_ids .. " user IDs")
  end
end

response = function(status, headers, body)
  if status == 201 then
    local id = string.match(body, '"id":"([^"]+)"')
    if id then
      table.insert(user_ids, id)
    end
  end
end

done = function(summary, latency, requests)
  print("--------- Benchmark Results ---------")
  print("Total requests: " .. summary.requests)
  print("Total errors: " .. summary.errors.connect + summary.errors.read + summary.errors.write + summary.errors.status + summary.errors.timeout)
  print("Requests/sec: " .. string.format("%.2f", summary.requests / summary.duration))
  print("Transfer/sec: " .. string.format("%.2f MB", summary.bytes / (1024 * 1024) / summary.duration))
  print("-------------------------------------")
  print("Latency Distribution:")
  for _, p in pairs({ 50, 75, 90, 99, 99.9 }) do
    n = latency:percentile(p)
    print(string.format("%g%%: %.2fms", p, n / 1000))
  end
end