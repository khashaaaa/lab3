#!/bin/bash

mkdir -p /benchmark/results

API_URL="http://localhost:3000"
echo "Benchmarking API at: $API_URL"

echo "Setting up benchmark data..."
curl -s -X POST "${API_URL}/users/benchmark/setup" \
  -H "Content-Type: application/json" \
  -d '{"count": 1000}'

sleep 2

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

echo "Running warm-up benchmark..."
wrk -t2 -c10 -d10s -s /benchmark/benchmark.lua ${API_URL}/ > /dev/null

echo "Running GET all users benchmark..."
wrk -t16 -c100 -d1m --latency ${API_URL}/users > "/benchmark/results/${TIMESTAMP}.txt"
cat "/benchmark/results/${TIMESTAMP}.txt"

echo "Cleaning up benchmark data..."
curl -s -X POST "${API_URL}/users/benchmark/setup" \
  -H "Content-Type: application/json" \
  -d '{"count": 0}'

echo "Benchmark complete. Results saved to /benchmark/results/"
ls -la /benchmark/results/