$(document).ready(function () {
    // 保存ボタンのクリックイベント
    $("#save").on("click", function () {
        const entry = {
            date: $("#date").val(),
            condition: $("#condition").val(),
            weight: $("#weight").val(),
            walkTime: $("#walk_time").val(),
            snack: $("#snack").val(),
            food: $("#food").val(),
            diary: $("#diary").val()
        };
         // データを保存した後、データを再取得し、currentIndexを更新
        saveEntry(entry);
        currentIndex = 0; // 最新のエントリを指すように設定
});


    //表示ボタンのクリックイベント
    $("#display").on("click", function () {
        const entries = getEntries();
        if (entries.length > 0) {
            currentIndex = 0;  //最新のエントリにインデックスをセット
            displayEntry(entries[currentIndex]);
        }
    });

     //非表示ボタンのクリックイベント
    $("#hide").on("click", function () {
        $("#entry_display").empty(); //現在表示されているエントリをクリアする
    });



    //クリアボタンのクリックイベント
    $("#clear").on("click", function () {
        localStorage.clear(); //ローカルストレージをクリア
        $("#entry_display").empty(); //現在表示されているエントリをクリアする
        currentIndex = -1;
    });

});


let currentIndex = -1; //ローカルストレージに保存されたエントリー（日記の記録）の中で現在表示しているもののインデックス（位置）を追跡
                       //-1 は、まだどのエントリーも選択されていないことを意味

function saveEntry(entry) { //エントリー（日記の記録）をローカルストレージに保存するために使用
    const currentEntries = getEntries(); //既存のエントリーを取得
    currentEntries.push(entry); //新しいエントリーを配列に追加
    currentEntries.sort((a, b) => new Date(b.date) - new Date(a.date)); //エントリーを日付の降順でソート
    localStorage.setItem("entries", JSON.stringify(currentEntries)); //更新されたエントリーのリストをローカルストレージに保存
}

function getEntries() { //ローカルストレージからすべてのエントリー（日記の記録）を取得するために使用
    const entries = JSON.parse(localStorage.getItem("entries")) || []; //ローカルストレージに保存されたエントリーを取得し、存在しない場合は空の配列を返します
    entries.sort((a, b) => new Date(b.date) - new Date(a.date)); //取得したエントリーは日付の降順にソート
    return entries; //ソートされたエントリーのリストが返されます。
}

function displayEntry(entry) { //日記の各エントリーの詳細をウェブページに表示
    const html = '<div class="entry">' +
        `<p>日付: ${entry.date}</p>` +
        `<p>体調: ${entry.condition}</p>` +
        `<p>体重: ${entry.weight}</p>` +
        `<p>散歩時間: ${entry.walkTime}</p>` +
        `<p>おやつ: ${entry.snack}</p>` +
        `<p>ごはん: ${entry.food}</p>` +
        `<p>日記: ${entry.diary}</p>` +
        `<button id="prev">最新</button>` +
        `<button id="next">過去へ</button>` +
        '</div>';
    $("#entry_display").html(html);

    //最新ボタン
    $("#prev").on("click", function () {
        const entries = getEntries();
        if (currentIndex > 0) {
            currentIndex--;
            displayEntry(entries[currentIndex]);
        }
    });
//より最近の日記のエントリーを表示します。具体的には、currentIndex（現在表示しているエントリーの位置を示す変数）の値を1減らすことで、前の（より新しい）エントリーに移動します。
//ただし、すでに最新のエントリーを表示している場合（currentIndexが0の場合）、何もしません。


    //過去へボタン
    $("#next").on("click", function () {
        const entries = getEntries();
        if (currentIndex < entries.length - 1) {
            currentIndex++;
            displayEntry(entries[currentIndex]);
        }
    });
}
//より古い日記のエントリーを表示します。ここでは、currentIndexの値を1増やすことで、次の（より古い）エントリーに移動します。
//ただし、すでに最も古いエントリーを表示している場合（currentIndexがエントリーの総数より1小さい数の場合）、何もしません。



//お知らせ
// JavaScriptを使ってテキストやアニメーションの速度を動的に変更する例
document.querySelector('.marquee-content').textContent = '今日も１日お疲れ様でした！今日の記録をつけましょう！';



// Chart.jsを使用した棒グラフの表示
function displayWeightChart() {
    const entries = getEntries();
    const labels = entries.map(entry => entry.date);
    const weightData = entries.map(entry => entry.weight);

    const ctx = document.getElementById('weightChart').getContext('2d');
    const weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '体重',
                data: weightData,

            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
            
                }
            }
        }
    });
}

function displayWalkTimeChart() {
    const entries = getEntries();
    const labels = entries.map(entry => entry.date);
    const walkTimeData = entries.map(entry => entry.walkTime); // 散歩時間データを正しく参照

    const ctx = document.getElementById('walkTimeChart').getContext('2d');
    const walkTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '散歩時間',
                data: walkTimeData, // 正しいデータを設定

            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

//グラフの表示
let isWeightChartDisplayed = false;
let isWalkTimeChartDisplayed = false;

function toggleWeightChartDisplay() {
    if (isWeightChartDisplayed) {
        document.getElementById('weightChart').style.display = 'none';
        isWeightChartDisplayed = false;
    } else {
        displayWeightChart();
        document.getElementById('weightChart').style.display = 'block';
        isWeightChartDisplayed = true;
    }
}

function toggleWalkTimeChartDisplay() {
    if (isWalkTimeChartDisplayed) {
        document.getElementById('walkTimeChart').style.display = 'none';
        isWalkTimeChartDisplayed = false;
    } else {
        displayWalkTimeChart();
        document.getElementById('walkTimeChart').style.display = 'block';
        isWalkTimeChartDisplayed = true;
    }
}


